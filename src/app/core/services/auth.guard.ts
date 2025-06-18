import { inject } from '@angular/core';
import { CanActivateFn, Router, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';
import { map, take } from 'rxjs/operators';
import { AuthService } from './auth.service';

export const authGuard: CanActivateFn = (): Observable<boolean | UrlTree> => {
  const authService = inject(AuthService);
  const router = inject(Router);

  return authService.userState$.pipe(
    take(1), // Pega o primeiro estado já cacheado pelo shareReplay
    map(({ user }) => user ? true : router.createUrlTree(['/login']))
  );
};

export const roleGuard = (allowedRoles: string[]): CanActivateFn => {
  return (): Observable<boolean | UrlTree> => {
    const authService = inject(AuthService);
    const router = inject(Router);

    return authService.userState$.pipe(
      take(1),
      map(({ user, profile }) =>
        (user && profile && allowedRoles.includes(profile.role))
          ? true
          : router.createUrlTree(['/dashboard'])
      )
    );
  };
};
