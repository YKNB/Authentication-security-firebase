import { CanMatchFn, Router } from '@angular/router';
import { inject } from '@angular/core';
import { AuthService, Role } from './auth.service';
import { map } from 'rxjs';

export function roleGuard(allowed: Role[]): CanMatchFn {
  return () => {
    const auth = inject(AuthService);
    const router = inject(Router);

    return auth.role$.pipe(
      map(role => {
        if (!role) return router.parseUrl('/login');
        if (allowed.includes(role)) return true;
        return router.parseUrl('/forbidden');
      })
    );
  };
}
