import { inject, Injectable, InjectionToken, signal } from '@angular/core';
import { Router } from '@angular/router';
import { Auth, authState, GoogleAuthProvider, signInWithPopup, User } from '@angular/fire/auth';
import { Firestore, doc, getDoc, setDoc, serverTimestamp, DocumentReference, DocumentSnapshot, collection } from '@angular/fire/firestore';
import { distinctUntilChanged, from, map, of, switchMap, tap, firstValueFrom } from 'rxjs';

import { UserProfile } from '../../models/user-profile.model';

// =================================================================
// TORNANDO O SERVIÇO 100% TESTÁVEL COM INJECTION TOKENS
// =================================================================
export const AUTH_STATE_FN = new InjectionToken<typeof authState>('Firebase authState function', { providedIn: 'root', factory: () => authState });
export const SIGN_IN_WITH_POPUP_FN = new InjectionToken<typeof signInWithPopup>('Firebase signInWithPopup function', { providedIn: 'root', factory: () => signInWithPopup });
export const DOC_FN = new InjectionToken<typeof doc>('Firestore doc function', { providedIn: 'root', factory: () => doc });
export const GET_DOC_FN = new InjectionToken<typeof getDoc>('Firestore getDoc function', { providedIn: 'root', factory: () => getDoc });
export const SET_DOC_FN = new InjectionToken<typeof setDoc>('Firestore setDoc function', { providedIn: 'root', factory: () => setDoc });
export const SERVER_TIMESTAMP_FN = new InjectionToken<typeof serverTimestamp>('Firestore serverTimestamp function', { providedIn: 'root', factory: () => serverTimestamp });


@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private readonly auth: Auth = inject(Auth);
  private readonly firestore: Firestore = inject(Firestore);
  private readonly router: Router = inject(Router);

  // Injetando todas as funções do Firebase
  private readonly authState = inject(AUTH_STATE_FN);
  private readonly signInWithPopup = inject(SIGN_IN_WITH_POPUP_FN);
  private readonly doc = inject(DOC_FN);
  private readonly getDoc = inject(GET_DOC_FN);
  private readonly setDoc = inject(SET_DOC_FN);
  private readonly serverTimestamp = inject(SERVER_TIMESTAMP_FN);

  readonly isLoading = signal(true);
  readonly currentUser = signal<User | null>(null);
  readonly userProfile = signal<UserProfile | null>(null);
  readonly authError = signal<string | null>(null);

  readonly userState$ = this.authState(this.auth).pipe(
    distinctUntilChanged(),
    tap(() => this.isLoading.set(true)),
    switchMap((user) => {
      if (user) {
        this.currentUser.set(user);
        return this.fetchUserProfile(user.uid).pipe(
          tap((profile) => {
            this.userProfile.set(profile);
            this.isLoading.set(false);
          })
        );
      } else {
        this.currentUser.set(null);
        this.userProfile.set(null);
        this.isLoading.set(false);
        return of(null);
      }
    })
  );

  constructor() {
    this.userState$.subscribe();
  }

  private fetchUserProfile(uid: string) {
    const userDocRef = this.doc(this.firestore, `users/${uid}`);
    return from(this.getDoc(userDocRef)).pipe(
      map((snapshot) => snapshot.exists() ? (snapshot.data() as UserProfile) : null)
    );
  }

  async loginWithGoogle(): Promise<void> {
    this.isLoading.set(true);
    this.authError.set(null);
    try {
      const provider = new GoogleAuthProvider();
      const credential = await this.signInWithPopup(this.auth, provider);

      const profile = await firstValueFrom(this.fetchUserProfile(credential.user.uid));

      if (!profile) {
        const userDocRef = this.doc(this.firestore, `users/${credential.user.uid}`);
        const newProfile: UserProfile = {
          uid: credential.user.uid,
          email: credential.user.email!,
          displayName: credential.user.displayName!,
          photoURL: credential.user.photoURL!,
          role: 'candidate',
          createdAt: this.serverTimestamp(),
          updatedAt: this.serverTimestamp(),
        };
        await this.setDoc(userDocRef, newProfile);
      }

      const redirectUrl = localStorage.getItem('redirectUrl') || '/dashboard';
      localStorage.removeItem('redirectUrl');
      this.router.navigate([redirectUrl]);

    } catch (error: any) {
      console.error('Login failed:', error);
      this.authError.set('Falha na autenticação. Por favor, tente novamente.');
    } finally {
      this.isLoading.set(false);
    }
  }

  async logout(): Promise<void> {
    this.isLoading.set(true);
    try {
      await this.auth.signOut();
      this.router.navigate(['/login']);
    } catch (error) {
      console.error('Logout failed:', error);
      this.authError.set('Falha ao fazer logout. Por favor, tente novamente.');
    } finally {
      this.isLoading.set(false);
    }
  }
}
