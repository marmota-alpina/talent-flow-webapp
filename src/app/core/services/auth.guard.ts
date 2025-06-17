import { inject, PLATFORM_ID } from '@angular/core'; // 1. Importe PLATFORM_ID
import { isPlatformBrowser } from '@angular/common'; // 2. Importe isPlatformBrowser
import {
  CanActivateFn,
  Router,
  ActivatedRouteSnapshot,
  RouterStateSnapshot
} from '@angular/router';
import { AuthService } from './auth.service';

/**
 * Guard to protect routes that require authentication
 * As per TFLOW-009 AC1, unauthenticated users will be redirected to the login page
 */
export const authGuard: CanActivateFn = (
  route: ActivatedRouteSnapshot,
  state: RouterStateSnapshot
) => {
  const router = inject(Router);
  const authService = inject(AuthService);
  const platformId = inject(PLATFORM_ID); // 3. Injete o PLATFORM_ID

  // 4. Verifique se o código está rodando no navegador antes de usar o localStorage
  if (isPlatformBrowser(platformId)) {
    // Store the attempted URL for redirecting after login
    localStorage.setItem('redirectUrl', state.url);
  }

  // Check if user is authenticated
  if (authService.currentUser()) {
    return true;
  }

  // If not authenticated, redirect to login page
  router.navigate(['/login']);
  return false;
};

/**
 * Guard to protect routes that require a specific role
 * This extends the basic auth guard to also check user roles
 */
export const roleGuard = (allowedRoles: string[]): CanActivateFn => {
  return (route: ActivatedRouteSnapshot, state: RouterStateSnapshot) => {
    const router = inject(Router);
    const authService = inject(AuthService);
    const platformId = inject(PLATFORM_ID); // 3. Injete o PLATFORM_ID

    // First check if user is authenticated
    if (!authService.currentUser()) {
      // 4. Verifique se o código está rodando no navegador antes de usar o localStorage
      if (isPlatformBrowser(platformId)) {
        // Store the attempted URL for redirecting after login
        localStorage.setItem('redirectUrl', state.url);
      }

      // Redirect to login page
      router.navigate(['/login']);
      return false;
    }

    // Then check if user has the required role
    const userProfile = authService.userProfile();

    if (userProfile && allowedRoles.includes(userProfile.role)) {
      return true;
    }

    // If user doesn't have the required role, redirect to dashboard
    router.navigate(['/dashboard']);
    return false;
  };
};
