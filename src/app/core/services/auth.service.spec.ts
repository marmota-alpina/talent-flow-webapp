import { Router } from '@angular/router';
import { Auth, User, UserCredential } from '@angular/fire/auth';
import { Firestore, Timestamp, DocumentData, DocumentReference, DocumentSnapshot } from '@angular/fire/firestore';
import { Injector } from '@angular/core';
import { BehaviorSubject, firstValueFrom} from 'rxjs';

import { AuthService, AUTH_STATE_FN, SIGN_IN_WITH_POPUP_FN, DOC_FN, GET_DOC_FN, SET_DOC_FN, SERVER_TIMESTAMP_FN } from './auth.service';
import { UserProfile } from '../../models/user-profile.model';

// Funções de mock (sem alterações)
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const createMockUser = (overrides?: Partial<User>): User => ({ uid: 'test-uid', email: 'test@example.com', displayName: 'Test User', photoURL: 'https://example.com/photo.jpg', emailVerified: true, isAnonymous: false, metadata: {} as any, providerData: [], refreshToken: 'test-token', tenantId: null, delete: () => Promise.resolve(), getIdToken: () => Promise.resolve('test-id-token'), getIdTokenResult: () => Promise.resolve({} as any), reload: () => Promise.resolve(), toJSON: () => ({}), phoneNumber: null, providerId: 'google.com', ...overrides });
const createMockUserProfile = (overrides?: Partial<UserProfile>): UserProfile => ({ uid: 'test-uid', email: 'test@example.com', displayName: 'Test User', photoURL: 'https://example.com/photo.jpg', role: 'candidate', createdAt: Timestamp.now(), updatedAt: Timestamp.now(), ...overrides });

// =================================================================
// SOLUÇÃO: Corrigimos o mock para satisfazer o TypeScript
// =================================================================
const createMockDocSnapshot = (exists: boolean, data: DocumentData | undefined): DocumentSnapshot => {
  const mock = {
    exists: () => exists,
    data: () => data,
    id: 'mock-doc-id',
    ref: { id: 'mock-doc-id' } as DocumentReference,
    get: (fieldPath: string) => data ? data[fieldPath] : undefined,
    // Adicionamos o método 'isEqual' que estava faltando
    metadata: {
      hasPendingWrites: false,
      fromCache: false,
      isEqual: () => false
    },
  };
  // Para resolver o erro do 'exists', nós convertemos para 'unknown' primeiro,
  // como sugerido pela própria mensagem de erro do compilador.
  return mock as unknown as DocumentSnapshot;
};

describe('AuthService (Fully Injected Mocks)', () => {
  let service: AuthService;
  let injector: Injector;

  let getDocSpy: jasmine.Spy;
  let setDocSpy: jasmine.Spy;
  let navigateSpy: jasmine.Spy;
  let signInWithPopupSpy: jasmine.Spy;
  let signOutSpy: jasmine.Spy;

  const mockUser = createMockUser();
  const mockProfile = createMockUserProfile();
  let authStateSub: BehaviorSubject<User | null>;

  beforeEach(() => {
    authStateSub = new BehaviorSubject<User | null>(null);

    // Usamos nosso novo helper corrigido para criar um mock completo
    getDocSpy = jasmine.createSpy('getDoc').and.resolveTo(createMockDocSnapshot(true, mockProfile));

    setDocSpy = jasmine.createSpy('setDoc').and.resolveTo(undefined);
    navigateSpy = jasmine.createSpy('navigate');
    signInWithPopupSpy = jasmine.createSpy('signInWithPopup').and.resolveTo({ user: mockUser } as UserCredential);
    signOutSpy = jasmine.createSpy('signOut').and.resolveTo(undefined);

    injector = Injector.create({
      providers: [
        AuthService,
        { provide: AUTH_STATE_FN, useValue: () => authStateSub.asObservable() },
        { provide: SIGN_IN_WITH_POPUP_FN, useValue: signInWithPopupSpy },
        { provide: DOC_FN, useValue: () => ({}) as DocumentReference },
        { provide: GET_DOC_FN, useValue: getDocSpy },
        { provide: SET_DOC_FN, useValue: setDocSpy },
        { provide: SERVER_TIMESTAMP_FN, useValue: () => Timestamp.now() },

        { provide: Auth, useValue: { signOut: signOutSpy } },
        { provide: Firestore, useValue: {} },
        { provide: Router, useValue: { navigate: navigateSpy } },
      ],
    });

    service = injector.get(AuthService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should initialize with null user when not logged in', async () => {
    authStateSub.next(null);
    await firstValueFrom(service.userState$);
    expect(service.currentUser()).toBeNull();
    expect(service.userProfile()).toBeNull();
  });

  it('should set user and profile when user logs in', async () => {
    authStateSub.next(mockUser);
    await firstValueFrom(service.userState$);

    expect(getDocSpy).toHaveBeenCalled();
    expect(service.currentUser()).toEqual(mockUser);
    expect(service.userProfile()).toEqual(mockProfile);
  });

  it('should handle login with Google and create new profile if one does not exist', async () => {
    // Usamos nosso helper para simular um documento que não existe
    getDocSpy.and.resolveTo(createMockDocSnapshot(false, undefined));
    spyOn(localStorage, 'getItem').and.returnValue('/dashboard');
    spyOn(localStorage, 'removeItem');

    await service.loginWithGoogle();

    authStateSub.next(mockUser);
    await firstValueFrom(service.userState$);

    expect(signInWithPopupSpy).toHaveBeenCalled();
    expect(setDocSpy).toHaveBeenCalled();
    expect(navigateSpy).toHaveBeenCalledWith(['/dashboard']);
  });

  it('should handle logout', async () => {
    authStateSub.next(mockUser);
    await firstValueFrom(service.userState$);
    expect(service.currentUser()).not.toBeNull();

    await service.logout();

    authStateSub.next(null);
    await firstValueFrom(service.userState$);

    expect(signOutSpy).toHaveBeenCalled();
    expect(service.currentUser()).toBeNull();
    expect(navigateSpy).toHaveBeenCalledWith(['/login']);
  });
});
