import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';

/**
 * Login component that provides Google authentication
 * As per TFLOW-009 AC2, this is a minimalist login screen with Google login button
 */
@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <div class="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div class="max-w-md w-full space-y-8">
        <div class="text-center">
          <h1 class="text-3xl font-bold text-gray-900 mb-2">Talent Flow</h1>
          <p class="text-gray-600">Conectando talentos e oportunidades</p>
        </div>

        <div class="mt-8">
          <!-- Login button -->
          <button
            (click)="login()"
            [disabled]="isLoading()"
            class="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-primary hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
          >
            @if (isLoading()) {
              <span class="absolute left-0 inset-y-0 flex items-center pl-3">
                <!-- Loading spinner -->
                <svg class="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                  <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
              </span>
            }
            @if (!isLoading()) {
              <span class="absolute left-0 inset-y-0 flex items-center pl-3">
                <!-- Google icon -->
                <svg class="h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12.545,10.239v3.821h5.445c-0.712,2.315-2.647,3.972-5.445,3.972c-3.332,0-6.033-2.701-6.033-6.032s2.701-6.032,6.033-6.032c1.498,0,2.866,0.549,3.921,1.453l2.814-2.814C17.503,2.988,15.139,2,12.545,2C7.021,2,2.543,6.477,2.543,12s4.478,10,10.002,10c8.396,0,10.249-7.85,9.426-11.748L12.545,10.239z"/>
                </svg>
              </span>
            }
            {{ isLoading() ? 'Entrando...' : 'Entrar com o Google' }}
          </button>
        </div>

        <!-- Error message -->
        @if (authError()) {
          <div class="mt-4 text-center text-sm text-red-600">
            {{ authError() }}
          </div>
        }
      </div>
    </div>
  `,
  styles: []
})
export class LoginComponent {
  private authService = inject(AuthService);

  // Get authentication state from the service
  isLoading = this.authService.isLoading;
  authError = this.authService.authError;

  /**
   * Handle login with Google
   */
  login(): void {
    this.authService.loginWithGoogle().subscribe();
  }
}
