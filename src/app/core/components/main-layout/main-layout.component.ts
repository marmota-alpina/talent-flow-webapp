import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { AuthService } from '../../services/auth.service';

/**
 * Main layout component for the application
 * As per TFLOW-010 AC3, this provides a consistent layout for all pages
 * with a fixed header containing logo, navigation, and user profile
 */
@Component({
  selector: 'app-main-layout',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <div class="min-h-screen flex flex-col bg-gray-50">
      <!-- Fixed header -->
      <header class="bg-white shadow-sm sticky top-0 z-10">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div class="flex justify-between h-16">
            <!-- Logo and navigation -->
            <div class="flex">
              <!-- Logo -->
              <div class="flex-shrink-0 flex items-center">
                <a routerLink="/dashboard" class="text-primary text-xl font-bold">Talent Flow</a>
              </div>

              <!-- Desktop navigation -->
              <nav class="hidden sm:ml-6 sm:flex sm:space-x-8">
                <a
                  routerLink="/dashboard"
                  routerLinkActive="border-primary text-gray-900"
                  [routerLinkActiveOptions]="{exact: true}"
                  class="border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700 inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium"
                >
                  Dashboard
                </a>

                <!-- Conditional navigation based on user role -->
                @if (userProfile() && userProfile()!.role === 'candidate') {
                  <a
                    routerLink="/meu-curriculo"
                    routerLinkActive="border-primary text-gray-900"
                    class="border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700 inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium"
                  >
                    Meu Currículo
                  </a>
                  <a
                    routerLink="/vagas"
                    routerLinkActive="border-primary text-gray-900"
                    class="border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700 inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium"
                  >
                    Vagas
                  </a>
                }

                @if (userProfile() && (userProfile()!.role === 'recruiter' || userProfile()!.role === 'admin')) {
                  <a
                    routerLink="/gerenciar-vagas"
                    routerLinkActive="border-primary text-gray-900"
                    class="border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700 inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium"
                  >
                    Gerenciar Vagas
                  </a>
                  <a
                    routerLink="/candidatos"
                    routerLinkActive="border-primary text-gray-900"
                    class="border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700 inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium"
                  >
                    Candidatos
                  </a>
                }
              </nav>
            </div>

            <!-- User profile dropdown -->
            <div class="flex items-center">
              <div class="ml-3 relative">
                <div class="flex items-center space-x-3">
                  <span class="text-sm text-gray-700 hidden md:block">{{ userProfile()?.displayName }}</span>

                  <!-- User photo from Google (as per ADR-012) -->
                  <div class="flex items-center">
                    @if (userProfile()?.photoURL) {
                      <img
                        [src]="userProfile()?.photoURL"
                        alt="Profile photo"
                        class="h-8 w-8 rounded-full"
                      >
                    }

                    <!-- Default avatar if no photo -->
                    @if (!userProfile()?.photoURL) {
                      <div
                        class="h-8 w-8 rounded-full bg-primary flex items-center justify-center text-white"
                      >
                        {{ userProfile()?.displayName ? userProfile()?.displayName?.charAt(0)?.toUpperCase() : 'U' }}
                      </div>
                    }

                    <!-- Logout button -->
                    <button
                      (click)="logout()"
                      class="ml-3 text-sm text-gray-500 hover:text-gray-700"
                    >
                      Sair
                    </button>
                  </div>
                </div>
              </div>
            </div>

            <!-- Mobile menu button -->
            <div class="flex items-center sm:hidden">
              <button
                type="button"
                (click)="toggleMobileMenu()"
                class="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-primary"
                aria-controls="mobile-menu"
                [attr.aria-expanded]="mobileMenuOpen"
              >
                <span class="sr-only">Open main menu</span>
                <!-- Icon when menu is closed -->
                @if (!mobileMenuOpen) {
                  <svg
                    class="block h-6 w-6"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    aria-hidden="true"
                  >
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16" />
                  </svg>
                }
                <!-- Icon when menu is open -->
                @if (mobileMenuOpen) {
                  <svg
                    class="block h-6 w-6"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    aria-hidden="true"
                  >
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                }
              </button>
            </div>
          </div>
        </div>

        <!-- Mobile menu, show/hide based on menu state -->
        <div
          id="mobile-menu"
          [class.hidden]="!mobileMenuOpen"
          class="sm:hidden"
        >
          <div class="pt-2 pb-3 space-y-1">
            <a
              routerLink="/dashboard"
              routerLinkActive="bg-primary text-white"
              [routerLinkActiveOptions]="{exact: true}"
              class="text-gray-600 hover:bg-gray-50 hover:text-gray-900 block pl-3 pr-4 py-2 border-l-4 border-transparent text-base font-medium"
            >
              Dashboard
            </a>

            <!-- Conditional navigation based on user role -->
            @if (userProfile() && userProfile()!.role === 'candidate') {
              <a
                routerLink="/meu-curriculo"
                routerLinkActive="bg-primary text-white"
                class="text-gray-600 hover:bg-gray-50 hover:text-gray-900 block pl-3 pr-4 py-2 border-l-4 border-transparent text-base font-medium"
              >
                Meu Currículo
              </a>
              <a
                routerLink="/vagas"
                routerLinkActive="bg-primary text-white"
                class="text-gray-600 hover:bg-gray-50 hover:text-gray-900 block pl-3 pr-4 py-2 border-l-4 border-transparent text-base font-medium"
              >
                Vagas
              </a>
            }

            @if (userProfile() && (userProfile()!.role === 'recruiter' || userProfile()!.role === 'admin')) {
              <a
                routerLink="/gerenciar-vagas"
                routerLinkActive="bg-primary text-white"
                class="text-gray-600 hover:bg-gray-50 hover:text-gray-900 block pl-3 pr-4 py-2 border-l-4 border-transparent text-base font-medium"
              >
                Gerenciar Vagas
              </a>
              <a
                routerLink="/candidatos"
                routerLinkActive="bg-primary text-white"
                class="text-gray-600 hover:bg-gray-50 hover:text-gray-900 block pl-3 pr-4 py-2 border-l-4 border-transparent text-base font-medium"
              >
                Candidatos
              </a>
            }
          </div>
        </div>
      </header>

      <!-- Main content -->
      <main class="flex-grow">
        <div class="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
          <router-outlet></router-outlet>
        </div>
      </main>

      <!-- Footer -->
      <footer class="bg-white border-t border-gray-200 py-4">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <p class="text-center text-sm text-gray-500">
            &copy; {{ currentYear }} Talent Flow. Todos os direitos reservados.
          </p>
        </div>
      </footer>
    </div>
  `,
  styles: []
})
export class MainLayoutComponent {
  private authService = inject(AuthService);

  // Get user profile from the service
  userProfile = this.authService.userProfile;

  // Mobile menu state
  mobileMenuOpen = false;

  // Current year for footer
  currentYear = new Date().getFullYear();

  /**
   * Toggle mobile menu visibility
   */
  toggleMobileMenu(): void {
    this.mobileMenuOpen = !this.mobileMenuOpen;
  }

  /**
   * Handle logout
   */
  logout(): void {
    this.authService.logout().subscribe();
  }
}
