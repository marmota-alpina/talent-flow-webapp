import { inject } from '@angular/core';
import { CanActivateFn, Router, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';
import { map, take } from 'rxjs/operators';
import { AuthService } from './auth.service';

export const authGuard: CanActivateFn = (): Observable<boolean | UrlTree> => {
  const authService = inject(AuthService);
  const router = inject(Router);

  return authService.userState$.pipe(
    take(1), // Pega o primeiro estado emitido para decidir
    map(() => {
      // A fonte da verdade agora são os signals, o userState$ apenas dispara a lógica
      return authService.currentUser()
        ? true
        : router.createUrlTree(['/login']);
    })
  );
};

export const roleGuard = (allowedRoles: string[]): CanActivateFn => {
  return (): Observable<boolean | UrlTree> => {
    const authService = inject(AuthService);
    const router = inject(Router);

    return authService.userState$.pipe(
      take(1),
      map(() => {
        const user = authService.currentUser();
        const profile = authService.userProfile();
        return user && profile && allowedRoles.includes(profile.role)
          ? true
          : router.createUrlTree(['/dashboard']);
      })
    );
  };
};
