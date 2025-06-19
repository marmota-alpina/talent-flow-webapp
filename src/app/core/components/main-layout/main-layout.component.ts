import { Component, ElementRef, HostListener, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { MainHeaderComponent } from '../main-header/main-header.component';
import { MainFooterComponent } from '../main-footer/main-footer.component';

@Component({
  selector: 'app-main-layout',
  imports: [CommonModule, RouterModule, MainHeaderComponent, MainFooterComponent],
  template: `
    <div id="main-layout" class="flex flex-col min-h-screen bg-gray-100">
      <app-main-header></app-main-header>
      <main class="flex-grow">
        <div class="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8 w-full">
          <router-outlet></router-outlet>
        </div>
      </main>
      <app-main-footer></app-main-footer>
    </div>
  `,
})
export class MainLayoutComponent {
  private authService = inject(AuthService);
  private elementRef = inject(ElementRef);
  userProfile = this.authService.userProfile;

  isDropdownOpen = signal(false);

  toggleDropdown(): void {
    this.isDropdownOpen.update(value => !value);
  }

  closeDropdown(): void {
    this.isDropdownOpen.set(false);
  }

  @HostListener('document:click', ['$event'])
  onDocumentClick(event: MouseEvent): void {
    const clickedInside = this.elementRef.nativeElement.contains(event.target);
    if (!clickedInside) {
      this.closeDropdown();
    }
  }

  logout(): void {
    this.closeDropdown();
    this.authService.logout();
  }
}
