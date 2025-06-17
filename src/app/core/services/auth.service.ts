import { ApplicationRef, inject, Injectable, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { Router } from '@angular/router';
import {
  Auth,
  authState,
  GoogleAuthProvider,
  onIdTokenChanged,
  signInWithPopup,
  User,
  signOut
} from '@angular/fire/auth';
import {
  doc,
  docData,
  Firestore,
  getDoc,
  setDoc
} from '@angular/fire/firestore';
import { EMPTY, Observable } from 'rxjs';
import { switchMap, tap } from 'rxjs/operators';
import { UserProfile } from '../../models/user-profile.model';
import { signal } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private platformId = inject(PLATFORM_ID);
  private auth: Auth = inject(Auth);
  private firestore: Firestore = inject(Firestore);
  private router: Router = inject(Router);
  private appRef: ApplicationRef = inject(ApplicationRef);

  // --- State Signals ---
  isLoading = signal(false);
  authError = signal<string | null>(null);
  currentUser = signal<User | null>(null);
  userProfile = signal<UserProfile | null>(null);

  // --- Observables for stream-based authentication state ---
  readonly currentUser$: Observable<User | null> = authState(this.auth);
  readonly userProfile$: Observable<UserProfile | null> = this.currentUser$.pipe(
    switchMap(user => {
      if (!user) {
        return EMPTY;
      }
      const userDocRef = doc(this.firestore, `users/${user.uid}`);
      return docData(userDocRef) as Observable<UserProfile | null>;
    }),
    tap(profile => this.userProfile.set(profile))
  );

  constructor() {
    this.initializeAuthStateListener();
  }

  /**
   * Initializes a listener for authentication state changes.
   * Updates user signals upon login or logout.
   */
  private initializeAuthStateListener(): void {
    onIdTokenChanged(this.auth, user => {
      this.currentUser.set(user);
      if (!user) {
        // Clear user profile on logout
        this.userProfile.set(null);
      }
    });
  }

  /**
   * Handle login with Google in a zoneless environment.
   */
  loginWithGoogle(): void {
    this.isLoading.set(true);
    this.authError.set(null);
    this.appRef.tick(); // Force UI update to show loading state

    const provider = new GoogleAuthProvider();

    signInWithPopup(this.auth, provider)
      .then(async (result) => {
        const user = result.user;
        await this.updateUserProfile(user);

        // Update state and navigate
        this.handlePostLoginRedirection();
        this.isLoading.set(false);

        // Manually trigger change detection for the entire application
        this.appRef.tick();
      })
      .catch((error) => {
        // On error, update the error state
        this.authError.set(this.getFriendlyErrorMessage(error.code));
        this.isLoading.set(false);

        // Manually trigger change detection to show the error
        this.appRef.tick();
      });
  }

  /**
   * Logs the user out.
   * @returns A promise that resolves when the user is logged out.
   */
  logout(): Promise<void> {
    return signOut(this.auth).then(() => {
      this.router.navigate(['/login']);
    });
  }

  /**
   * Creates or updates a user's profile in Firestore.
   * @param user The user object from Firebase Auth.
   * @private
   */
  private async updateUserProfile(user: User): Promise<void> {
    const userRef = doc(this.firestore, `users/${user.uid}`);
    const userDoc = await getDoc(userRef);

    const userData: UserProfile = {
      uid: user.uid,
      email: user.email!,
      displayName: user.displayName!,
      photoURL: user.photoURL!,
      createdAt: new Date(),
      updatedAt: new Date(),
      // Assign 'candidate' role if the user is new, otherwise keep existing role
      role: userDoc.exists() ? userDoc.data()['role'] : 'candidate',
    };

    // Use setDoc with merge to create or update the document
    await setDoc(userRef, userData, { merge: true });
    this.userProfile.set(userData); // Also update the local signal
  }

  /**
   * Handles redirection after a successful login.
   * Reads a stored URL from localStorage or defaults to the dashboard.
   * @private
   */
  private handlePostLoginRedirection(): void {
    if (isPlatformBrowser(this.platformId)) {
      const redirectUrl = localStorage.getItem('redirectUrl') || '/dashboard';
      localStorage.removeItem('redirectUrl');
      this.router.navigateByUrl(redirectUrl);
    } else {
      // Default server-side redirect
      this.router.navigate(['/dashboard']);
    }
  }

  /**
   * Converts Firebase error codes to user-friendly messages.
   * @param errorCode The error code from Firebase.
   * @private
   */
  private getFriendlyErrorMessage(errorCode: string): string {
    switch (errorCode) {
      case 'auth/popup-closed-by-user':
        return 'A janela de login foi fechada antes da conclusão. Por favor, tente novamente.';
      case 'auth/cancelled-popup-request':
        return 'Múltiplas tentativas de login detectadas. Por favor, complete uma de cada vez.';
      default:
        return 'Ocorreu um erro durante o login. Por favor, tente novamente mais tarde.';
    }
  }
}
