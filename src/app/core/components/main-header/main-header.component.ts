import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-main-header',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './main-header.component.html',
  styleUrl: './main-header.component.scss'
})
export class MainHeaderComponent {
  private authService = inject(AuthService);

  // User profile signal
  userProfile = this.authService.userProfile;

  // Dropdown state
  isDropdownOpen = signal<boolean>(false);

  // Toggle dropdown menu
  toggleDropdown(): void {
    this.isDropdownOpen.update(value => !value);
  }

  // Close dropdown menu
  closeDropdown(): void {
    this.isDropdownOpen.set(false);
  }

  // Logout user
  logout(): void {
    this.closeDropdown();
    this.authService.logout();
  }
}
