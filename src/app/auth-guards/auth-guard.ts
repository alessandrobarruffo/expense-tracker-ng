import { CanActivateFn, RedirectCommand, Router } from '@angular/router';
import { inject } from '@angular/core';
import { AuthenticationService } from '../services/authentication.service';

export const isLogged: CanActivateFn = (route, state) => {
  const isAuthenticated = inject(AuthenticationService).isLoggedIn();
  if (isAuthenticated) {
    return true;
  }
  return new RedirectCommand(inject(Router).parseUrl('/login'));
};
