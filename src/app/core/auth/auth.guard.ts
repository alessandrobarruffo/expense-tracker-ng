import { CanActivateFn, RedirectCommand, Router } from '@angular/router';
import { inject } from '@angular/core';
import { authStore } from './auth.store';

export const isLogged: CanActivateFn = () => {
  const isAuthenticated = inject(authStore).isLoggedIn();
  if (isAuthenticated) {
    return true;
  }
  return new RedirectCommand(inject(Router).parseUrl('/login'));
};
