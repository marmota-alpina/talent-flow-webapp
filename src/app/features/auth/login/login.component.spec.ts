import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { By } from '@angular/platform-browser';
import { signal, provideZonelessChangeDetection, WritableSignal } from '@angular/core';
import { LoginComponent } from './login.component';
import { AuthService } from '../../../core/services/auth.service';

describe('LoginComponent (Zoneless)', () => {
  let component: LoginComponent;
  let fixture: ComponentFixture<LoginComponent>;
  let mockAuthService: jasmine.SpyObj<AuthService>;

  beforeEach(async () => {
    // Create a mock AuthService with spies for the methods and signals
    mockAuthService = jasmine.createSpyObj('AuthService', ['loginWithGoogle'], {
      isLoading: signal(false),
      authError: signal(null)
    });

    await TestBed.configureTestingModule({
      imports: [RouterTestingModule, LoginComponent],
      providers: [
        provideZonelessChangeDetection(),
        { provide: AuthService, useValue: mockAuthService }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(LoginComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should display the login button with correct text', () => {
    const buttonElement = fixture.debugElement.query(By.css('button')).nativeElement;
    expect(buttonElement.textContent.trim()).toBe('Entrar com o Google');
  });

  it('should call loginWithGoogle when login button is clicked', () => {
    const buttonElement = fixture.debugElement.query(By.css('button'));
    buttonElement.triggerEventHandler('click', null);
    expect(mockAuthService.loginWithGoogle).toHaveBeenCalled();
  });

  it('should show loading state when isLoading is true', () => {
    // Update the isLoading signal to true
    (mockAuthService.isLoading as WritableSignal<boolean>).set(true);
    fixture.detectChanges();

    const buttonElement = fixture.debugElement.query(By.css('button')).nativeElement;
    expect(buttonElement.textContent.trim()).toBe('Entrando...');
    expect(buttonElement.disabled).toBeTrue();
    expect(fixture.debugElement.query(By.css('.animate-spin'))).toBeTruthy();
  });

  it('should show error message when authError has a value', () => {
    const errorMessage = 'Authentication failed';
    (mockAuthService.authError as WritableSignal<string | null>).set(errorMessage);
    fixture.detectChanges();

    const errorElement = fixture.debugElement.query(By.css('.text-red-600')).nativeElement;
    expect(errorElement.textContent.trim()).toBe(errorMessage);
  });
});
