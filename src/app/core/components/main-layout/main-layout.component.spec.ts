import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { By } from '@angular/platform-browser';
import { signal, provideZonelessChangeDetection } from '@angular/core';
import { MainLayoutComponent } from './main-layout.component';
import { AuthService } from '../../services/auth.service';
import { UserProfile } from '../../../models/user-profile.model';

describe('MainLayoutComponent (Zoneless)', () => {
  let component: MainLayoutComponent;
  let fixture: ComponentFixture<MainLayoutComponent>;
  let mockAuthService: jasmine.SpyObj<AuthService>;
  let mockUserProfile: UserProfile;

  beforeEach(async () => {
    // Create mock user profile
    mockUserProfile = {
      uid: 'test-uid',
      email: 'test@example.com',
      displayName: 'Test User',
      photoURL: 'https://example.com/photo.jpg',
      role: 'candidate',
      createdAt: { toDate: () => new Date() } as any,
      updatedAt: { toDate: () => new Date() } as any
    };

    // Create mock AuthService
    mockAuthService = jasmine.createSpyObj('AuthService', ['logout'], {
      userProfile: signal(mockUserProfile)
    });

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

  it('should display user profile information', () => {
    const displayNameElement = fixture.debugElement.query(By.css('.font-semibold')).nativeElement;
    const profileImageElement = fixture.debugElement.query(By.css('img')).nativeElement;

    expect(displayNameElement.textContent).toContain(mockUserProfile.displayName);
    expect(profileImageElement.src).toContain(mockUserProfile.photoURL);
    expect(profileImageElement.alt).toBe('Foto do Perfil');
  });

  it('should toggle dropdown when profile button is clicked', () => {
    // Initially dropdown should be closed
    expect(component.isDropdownOpen()).toBeFalse();

    // Click the profile button
    const profileButton = fixture.debugElement.query(By.css('button'));
    profileButton.triggerEventHandler('click', null);
    fixture.detectChanges();

    // Dropdown should be open
    expect(component.isDropdownOpen()).toBeTrue();
    expect(fixture.debugElement.query(By.css('.origin-top-right'))).toBeTruthy();

    // Click the profile button again
    profileButton.triggerEventHandler('click', null);
    fixture.detectChanges();

    // Dropdown should be closed
    expect(component.isDropdownOpen()).toBeFalse();
    expect(fixture.debugElement.query(By.css('.origin-top-right'))).toBeNull();
  });

  it('should close dropdown when clicking outside', () => {
    // Open the dropdown
    component.isDropdownOpen.set(true);
    fixture.detectChanges();

    // Simulate a click outside the component
    const event = new MouseEvent('click', {
      bubbles: true,
      cancelable: true
    });

    // Mock the contains method to return false (click outside)
    spyOn(fixture.nativeElement, 'contains').and.returnValue(false);

    // Trigger the document click event
    document.dispatchEvent(event);
    fixture.detectChanges();

    // Dropdown should be closed
    expect(component.isDropdownOpen()).toBeFalse();
  });

  it('should call logout when logout button is clicked', () => {
    // Open the dropdown
    component.isDropdownOpen.set(true);
    fixture.detectChanges();

    // Click the logout button
    const logoutButton = fixture.debugElement.query(By.css('.text-red-600'));
    logoutButton.triggerEventHandler('click', null);

    // Verify logout was called
    expect(mockAuthService.logout).toHaveBeenCalled();

    // Dropdown should be closed
    expect(component.isDropdownOpen()).toBeFalse();
  });
});
