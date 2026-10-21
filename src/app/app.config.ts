import {
  ApplicationConfig,
  inject,
  provideAppInitializer,
  provideBrowserGlobalErrorListeners,
} from '@angular/core';
import { provideRouter } from '@angular/router';

import { routes } from './app.routes';
import { provideOptimus } from '@openng/optimus-ui/config';
import Material from '@openng/optimus-ui-themes/material';
import { AuthenticationService } from './services/authentication.service';
import { catchError, EMPTY } from 'rxjs';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { refreshTokenInterceptor } from './interceptors/refresh-token.interceptor';
import { errorInterceptor } from './interceptors';

export const appConfig: ApplicationConfig = {
  providers: [
    provideAppInitializer(() => {
      const authenticationService = inject(AuthenticationService);
      return authenticationService.refresh().pipe(
        catchError(() => {
          return EMPTY;
        }),
      );
    }),
    provideBrowserGlobalErrorListeners(),
    provideRouter(routes),
    provideOptimus({ theme: { preset: Material } }),
    provideHttpClient(withInterceptors([refreshTokenInterceptor, errorInterceptor])),
  ],
};
