import { Component, ElementRef, HostListener, inject, signal } from '@angular/core';
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
  imports: [CommonModule, RouterModule],
  template: `
    <div class="min-h-screen bg-gray-100">
      <header class="bg-white shadow-sm">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div class="flex justify-between items-center h-16">
            <div class="flex-shrink-0">
              <a routerLink="/dashboard" class="text-2xl font-bold text-primary">Talent Flow</a>
            </div>

            <div class="relative ml-4 flex items-center">
              <button (click)="toggleDropdown()" class="flex items-center gap-2 text-sm rounded-full focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary">
                <span class="hidden sm:inline font-semibold text-gray-700 text-sm">{{ userProfile()?.displayName }}</span>
                <img class="w-8 h-8 rounded-full" [src]="userProfile()?.photoURL || 'assets/images/default-avatar.png'" alt="Foto do Perfil">
              </button>

              @if (isDropdownOpen()) {
                <div class="origin-top-right absolute right-0 top-12 w-48 rounded-md shadow-lg py-1 bg-white ring-1 ring-black ring-opacity-5 focus:outline-none">
                  <a routerLink="/meu-curriculo" (click)="closeDropdown()" class="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">Meu Currículo</a>
                  <button (click)="logout()" class="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 cursor-pointer">Sair</button>
                </div>
              }
            </div>
          </div>
        </div>
      </header>

      <main>
        <div class="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
          <router-outlet></router-outlet>
        </div>
      </main>
    </div>
  `,
})
export class MainLayoutComponent {
  private authService = inject(AuthService);
  private elementRef = inject(ElementRef);
  userProfile = this.authService.userProfile;

  isDropdownOpen = signal(false);

  /**
   * Altera a visibilidade do menu dropdown.
   */
  toggleDropdown(): void {
    this.isDropdownOpen.update(value => !value);
  }

  /**
   * Fecha o menu dropdown.
   */
  closeDropdown(): void {
    this.isDropdownOpen.set(false);
  }

  /**
   * Escuta por cliques no documento. Se o clique for fora do componente,
   * fecha o menu dropdown.
   * @param event O evento de clique.
   */
  @HostListener('document:click', ['$event'])
  onDocumentClick(event: MouseEvent): void {
    const clickedInside = this.elementRef.nativeElement.contains(event.target);
    if (!clickedInside) {
      this.closeDropdown();
    }
  }

  /**
   * Executa o logout do usuário.
   */
  logout(): void {
    this.closeDropdown(); // Fecha o menu antes de deslogar
    this.authService.logout();
  }
}
