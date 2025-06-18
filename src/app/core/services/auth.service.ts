import { ApplicationRef, inject, Injectable, PLATFORM_ID, signal } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { Router } from '@angular/router';
import { Auth, authState, GoogleAuthProvider, signInWithPopup, User, signOut } from '@angular/fire/auth';
import { doc, Firestore, getDoc, setDoc, Timestamp } from '@angular/fire/firestore';
import { Observable, of, from } from 'rxjs';
import { map, shareReplay, switchMap, tap } from 'rxjs/operators';
import { UserProfile } from '../../models/user-profile.model';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private platformId = inject(PLATFORM_ID);
  private auth: Auth = inject(Auth);
  private firestore: Firestore = inject(Firestore);
  private router: Router = inject(Router);
  private appRef: ApplicationRef = inject(ApplicationRef);

  // Signals para acesso síncrono e fácil na UI
  currentUser = signal<User | null>(null);
  userProfile = signal<UserProfile | null>(null);
  isLoading = signal<boolean>(false);
  authError = signal<string | null>(null);

  /**
   * A FONTE ÚNICA DA VERDADE:
   * Este é o observable principal que combina o estado de autenticação com o perfil do Firestore.
   * shareReplay(1) é a chave: ele transforma o observable em "hot", executa a lógica
   * uma vez e guarda o último resultado para qualquer novo inscrito (guards, resolvers).
   */
  readonly userState$: Observable<{ user: User | null; profile: UserProfile | null }> = authState(this.auth).pipe(
    switchMap(user => {
      if (!user) {
        return of({ user: null, profile: null });
      }
      const userDocRef = doc(this.firestore, `users/${user.uid}`);
      // Use from(getDoc()) instead of docData() to avoid Firebase query type error
      return from(getDoc(userDocRef)).pipe(
        map(docSnap => ({
          user,
          profile: docSnap.exists() ? docSnap.data() as UserProfile : null
        }))
      );
    }),
    tap(({ user, profile }) => {
      // Atualiza os signals para que o resto da aplicação possa usá-los
      this.currentUser.set(user);
      this.userProfile.set(profile);
      this.appRef.tick(); // Força a detecção de mudanças em ambiente zoneless
    }),
    shareReplay(1) // ESSENCIAL: Cacheia o último estado e o compartilha
  );

  constructor() {
    // "Liga" o observable principal assim que o serviço é criado.
    // Ele ficará ativo em background, mantendo o estado do usuário sempre atualizado.
    this.userState$.subscribe(({ user }) => {
      // Refresh the user profile on application start to ensure photoURL is up-to-date
      if (user) {
        this.refreshUserProfile(user);
      }
    });
  }

  /**
   * Refreshes the user profile data to ensure it's up-to-date,
   * particularly for fixing profile photo URLs that might be broken.
   */
  private refreshUserProfile(user: User): void {
    // Only refresh once per session to avoid unnecessary Firestore writes
    if (!this._profileRefreshed) {
      this.updateUserProfile(user);
      this._profileRefreshed = true;
    }
  }

  // Flag to track if profile has been refreshed in this session
  private _profileRefreshed = false;

  loginWithGoogle(): Promise<void> {
    this.isLoading.set(true);
    this.authError.set(null);

    const provider = new GoogleAuthProvider();
    return signInWithPopup(this.auth, provider)
      .then(async (result) => {
        await this.updateUserProfile(result.user);
        this.handlePostLoginRedirection();
        this.isLoading.set(false);
      })
      .catch((error) => {
        console.error('Authentication error:', error);
        this.authError.set('Falha na autenticação. Por favor, tente novamente.');
        this.isLoading.set(false);
        return Promise.reject(error);
      });
  }

  logout(): Promise<void> {
    return signOut(this.auth).then(() => {
      this.router.navigate(['/login']);
    });
  }

  private async updateUserProfile(user: User): Promise<void> {
    const userRef = doc(this.firestore, `users/${user.uid}`);
    const userDoc = await getDoc(userRef);

    // Ensure the photoURL is properly persisted by making it a permanent URL
    // Google profile photos sometimes use temporary URLs that expire or require authentication
    let photoURL = user.photoURL ?? '';
    if (photoURL && photoURL.includes('googleusercontent.com')) {
      // Remove any size parameters and ensure it's a permanent URL
      photoURL = photoURL.split('=')[0] + '=s96-c';
    }

    const userData: UserProfile = {
      uid: user.uid,
      email: user.email ?? 'N/A',
      displayName: user.displayName ?? 'Usuário',
      photoURL: photoURL,
      role: userDoc.exists() ? userDoc.data()['role'] : 'candidate',
      createdAt: userDoc.exists() ? userDoc.data()['createdAt'] : Timestamp.now(),
      updatedAt: Timestamp.now(),
    };
    await setDoc(userRef, userData, { merge: true });
  }

  private handlePostLoginRedirection(): void {
    if (isPlatformBrowser(this.platformId)) {
      const redirectUrl = localStorage.getItem('redirectUrl') || '/dashboard';
      localStorage.removeItem('redirectUrl');

      // Always navigate to a known route to avoid blank screen issues
      if (redirectUrl === '/' || redirectUrl === '') {
        this.router.navigate(['/dashboard']);
      } else {
        // Use navigate instead of navigateByUrl for more reliable routing
        // Remove any leading slash to ensure proper route resolution
        const formattedUrl = redirectUrl.startsWith('/') ? redirectUrl.substring(1) : redirectUrl;
        this.router.navigate([formattedUrl]);
      }
    }
  }
}
