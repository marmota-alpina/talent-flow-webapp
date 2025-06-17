import { Injectable, inject, signal } from '@angular/core';
import { Router } from '@angular/router';
import {
  Auth,
  GoogleAuthProvider,
  User,
  signInWithPopup,
  signOut,
  onAuthStateChanged
} from '@angular/fire/auth';
import {
  Firestore,
  doc,
  getDoc,
  setDoc,
  serverTimestamp
} from '@angular/fire/firestore';
import { UserProfile } from '../../models/user-profile.model';
import { Observable, from, of } from 'rxjs';
import { switchMap, tap, catchError, map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private auth = inject(Auth);
  private firestore = inject(Firestore);
  private router = inject(Router);

  // Signal for the current Firebase user
  readonly currentUser = signal<User | null>(null);

  // Signal for the current user profile from Firestore
  readonly userProfile = signal<UserProfile | null>(null);

  // Signal for authentication loading state
  readonly isLoading = signal<boolean>(false);

  // Signal for authentication error
  readonly authError = signal<string | null>(null);

  constructor() {
    // Listen for authentication state changes
    onAuthStateChanged(this.auth, (user) => {
      this.currentUser.set(user);

      if (user) {
        // If user is authenticated, fetch their profile
        this.fetchUserProfile(user.uid);
      } else {
        // If user is not authenticated, clear the profile
        this.userProfile.set(null);
      }
    });
  }

  /**
   * Sign in with Google using a popup
   * As per ADR-011, this will create or update the user profile in Firestore
   */
  loginWithGoogle(): Observable<UserProfile> {
    this.isLoading.set(true);
    this.authError.set(null);

    const provider = new GoogleAuthProvider();

    return from(signInWithPopup(this.auth, provider)).pipe(
      switchMap(result => {
        const user = result.user;
        return this.createOrUpdateUserProfile(user);
      }),
      tap(userProfile => {
        this.isLoading.set(false);
        this.userProfile.set(userProfile);

        // Handle redirection based on user role and profile status
        this.handlePostLoginRedirection(userProfile);
      }),
      catchError(error => {
        this.isLoading.set(false);
        this.authError.set(error.message || 'An error occurred during login');
        return of(null as unknown as UserProfile);
      })
    );
  }

  /**
   * Sign out the current user
   */
  logout(): Observable<void> {
    return from(signOut(this.auth)).pipe(
      tap(() => {
        this.router.navigate(['/login']);
      }),
      catchError(error => {
        this.authError.set(error.message || 'An error occurred during logout');
        return of(void 0);
      })
    );
  }

  /**
   * Create or update the user profile in Firestore
   * As per ADR-011, this uses setDoc with merge: true
   */
  private createOrUpdateUserProfile(user: User): Observable<UserProfile> {
    const userRef = doc(this.firestore, `users/${user.uid}`);

    return from(getDoc(userRef)).pipe(
      switchMap(docSnap => {
        const now = serverTimestamp();

        // Basic profile data from Firebase Auth
        const profileData: Partial<UserProfile> = {
          uid: user.uid,
          displayName: user.displayName || 'User',
          email: user.email || '',
          photoURL: user.photoURL || undefined,
          updatedAt: now as unknown as Date
        };

        if (!docSnap.exists()) {
          // First login - create new profile with default role
          const newProfile: Partial<UserProfile> = {
            ...profileData,
            role: 'candidate',
            createdAt: now as unknown as Date
          };

          return from(setDoc(userRef, newProfile)).pipe(
            switchMap(() => from(getDoc(userRef))),
            map(newDoc => newDoc.data() as UserProfile)
          );
        } else {
          // Subsequent login - update only basic profile data
          return from(setDoc(userRef, profileData, { merge: true })).pipe(
            switchMap(() => from(getDoc(userRef))),
            map(updatedDoc => updatedDoc.data() as UserProfile)
          );
        }
      })
    );
  }

  /**
   * Fetch the user profile from Firestore
   */
  private fetchUserProfile(uid: string): void {
    const userRef = doc(this.firestore, `users/${uid}`);

    getDoc(userRef)
      .then(docSnap => {
        if (docSnap.exists()) {
          this.userProfile.set(docSnap.data() as UserProfile);
        }
      })
      .catch(error => {
        console.error('Error fetching user profile:', error);
      });
  }

  /**
   * Handle redirection after successful login based on user role and profile status
   * As per TFLOW-009 AC6
   */
  private handlePostLoginRedirection(userProfile: UserProfile): void {
    // Check if there's a redirect URL stored (user was trying to access a protected route)
    const redirectUrl = localStorage.getItem('redirectUrl');

    if (redirectUrl) {
      // Clear the stored URL and redirect to the original destination
      localStorage.removeItem('redirectUrl');
      this.router.navigateByUrl(redirectUrl);
      return;
    }

    // Default redirection based on user role
    switch (userProfile.role) {
      case 'candidate': {
        // For candidates, we need to check if they have a resume
        // This is a placeholder - in a real implementation, you would check Firestore
        const hasResume = false; // This would be determined by checking Firestore

        if (hasResume) {
          this.router.navigate(['/meu-painel']);
        } else {
          this.router.navigate(['/meu-curriculo/editar']);
        }
        break;
      }

      case 'recruiter':
      case 'admin':
        this.router.navigate(['/gerenciar-vagas']);
        break;

      default:
        this.router.navigate(['/dashboard']);
    }
  }

  /**
   * Check if the current user has a specific role
   */
  hasRole(role: string): boolean {
    const profile = this.userProfile();
    return profile ? profile.role === role : false;
  }
}
