import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter, Router } from '@angular/router';
import { Location } from '@angular/common';
import { provideZonelessChangeDetection } from '@angular/core';
import { signal, WritableSignal } from '@angular/core';
import { Observable, of } from 'rxjs';

import { App } from './app';
import { routes } from './app.routes';
import { AuthService } from './core/services/auth.service';
import { User } from '@angular/fire/auth';
import { UserProfile } from './models/user-profile.model';

// Componentes necessários para as rotas
import { LoginComponent } from './features/auth/login/login.component';
import { MainLayoutComponent } from './core/components/main-layout/main-layout.component';

// Mock do AuthService para isolar os testes
class MockAuthService {
  isLoading: WritableSignal<boolean> = signal(false);
  authError: WritableSignal<string | null> = signal(null);
  currentUser: WritableSignal<User | null> = signal(null);
  userProfile: WritableSignal<UserProfile | null> = signal(null);
  loginWithGoogle = jasmine.createSpy('loginWithGoogle');
  logout = jasmine.createSpy('logout').and.returnValue(Promise.resolve());

  // Create a proper Observable for userState$ that the authGuard depends on
  // This implementation will create a new Observable each time it's accessed,
  // which will reflect the current values of currentUser and userProfile
  get userState$(): Observable<{ user: User | null; profile: UserProfile | null }> {
    return of({
      user: this.currentUser(),
      profile: this.userProfile()
    });
  }

  constructor() {
    // Subscribe to userState$ to simulate the behavior in the real AuthService
    this.userState$.subscribe();
  }
}

describe('App Component and Routing (Zoneless)', () => {
  let fixture: ComponentFixture<App>;
  let router: Router;
  let location: Location;
  let authService: MockAuthService;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [App, LoginComponent, MainLayoutComponent],
      providers: [
        provideZonelessChangeDetection(),
        provideRouter(routes),
        { provide: AuthService, useClass: MockAuthService },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(App);
    router = TestBed.inject(Router);
    location = TestBed.inject(Location);
    authService = TestBed.inject(AuthService) as unknown as MockAuthService;

    // Ensure user is not authenticated for tests
    authService.currentUser.set(null);
    authService.userProfile.set(null);

    await fixture.ngZone?.run(async () => router.initialNavigation());
  });

  it('should create the app', () => {
    const app = fixture.componentInstance;
    expect(app).toBeTruthy();
  });

  it('should have a <router-outlet>', () => {
    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.querySelector('router-outlet')).not.toBeNull();
  });

  it('should navigate to the /login page by default', async () => {
    // Ensure user is not authenticated
    authService.currentUser.set(null);
    authService.userProfile.set(null);

    // Trigger initial navigation
    await fixture.ngZone?.run(async () => await router.navigate(['']));

    fixture.detectChanges();
    await fixture.whenStable();

    // The authGuard should redirect to /login since user is not authenticated
    expect(location.path()).toBe('/login');
  });

  it('should render the login component when navigating to /login', async () => {
    await fixture.ngZone?.run(async () => await router.navigate(['/login']));
    await fixture.whenStable();
    fixture.detectChanges();

    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.querySelector('button')?.textContent).toContain('Entrar com o Google');
  });

  it('should redirect a non-authenticated user from /dashboard to /login', async () => {
    // Ensure user is not authenticated
    authService.currentUser.set(null);
    authService.userProfile.set(null);

    // Navigate to dashboard
    await fixture.ngZone?.run(async () => await router.navigate(['/dashboard']));

    fixture.detectChanges();
    await fixture.whenStable();

    // The authGuard should redirect to /login since user is not authenticated
    expect(location.path()).toBe('/login');
  });
});
