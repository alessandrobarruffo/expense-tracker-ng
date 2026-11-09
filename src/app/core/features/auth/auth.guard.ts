import { CanActivateFn, RedirectCommand, Router } from '@angular/router';
import { inject } from '@angular/core';
import { AuthStore } from './auth.store';

export const isLogged: CanActivateFn = () => {
  const isAuthenticated = inject(AuthStore).isLoggedIn();
  if (isAuthenticated) {
    return true;
  }
  return new RedirectCommand(inject(Router).parseUrl('/login'));
};
