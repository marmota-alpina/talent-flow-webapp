import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter, Router } from '@angular/router';
import { Location } from '@angular/common';
import { provideZonelessChangeDetection } from '@angular/core';
import { signal, WritableSignal } from '@angular/core';

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
    fixture.detectChanges();
    await fixture.whenStable();
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
    authService.currentUser.set(null);

    await fixture.ngZone?.run(async () => await router.navigate(['/dashboard']));
    await fixture.whenStable();

    expect(location.path()).toBe('/login');
  });
});
