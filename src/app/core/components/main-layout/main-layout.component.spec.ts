import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { By } from '@angular/platform-browser';
import { User } from '@angular/fire/auth';
import { signal, provideZonelessChangeDetection, WritableSignal } from '@angular/core';
import { MainLayoutComponent } from './main-layout.component';
import { AuthService } from '../../services/auth.service';
import { UserProfile } from '../../../models/user-profile.model';

describe('MainLayoutComponent', () => {
  let component: MainLayoutComponent;
  let fixture: ComponentFixture<MainLayoutComponent>;
  let mockAuthService: {
    currentUser: WritableSignal<User | null>;
    userProfile: WritableSignal<UserProfile | null>;
    logout: jasmine.Spy<() => Promise<void>>;
  };

  beforeEach(async () => {
    mockAuthService = {
      currentUser: signal(null),
      userProfile: signal(null),
      logout: jasmine.createSpy('logout').and.resolveTo()
    };

    await TestBed.configureTestingModule({
      imports: [RouterTestingModule, MainLayoutComponent],
      providers: [
        provideZonelessChangeDetection(),
        { provide: AuthService, useValue: mockAuthService }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(MainLayoutComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should display user name when user is logged in', () => {
    const testUser = { displayName: 'Test User' } as User;
    const testUserProfile = { displayName: 'Test User Profile' } as UserProfile;
    mockAuthService.currentUser.set(testUser);
    mockAuthService.userProfile.set(testUserProfile);
    fixture.detectChanges();

    const displayNameElement = fixture.debugElement.query(By.css('.text-sm.font-semibold'));
    expect(displayNameElement.nativeElement.textContent).toContain('Test User');
  });

  it('should not display user name when user is logged out', () => {
    mockAuthService.currentUser.set(null);
    mockAuthService.userProfile.set(null);
    fixture.detectChanges();

    const displayNameElement = fixture.debugElement.query(By.css('.text-sm.font-semibold'));
    expect(displayNameElement).toBeNull();
  });

  it('should close dropdown when clicking outside', () => {
    component.isDropdownOpen.set(true);
    fixture.detectChanges();

    document.dispatchEvent(new MouseEvent('click'));
    fixture.detectChanges();

    expect(component.isDropdownOpen()).toBeFalse();
  });
});
