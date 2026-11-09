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
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { errorInterceptor } from './core/interceptors';
import { authInterceptor } from './core/features/auth/auth.interceptor';
import { AuthStore } from './core/features/auth/auth.store';

export const appConfig: ApplicationConfig = {
  providers: [
    provideAppInitializer(() => {
      return inject(AuthStore).refresh();
    }),
    provideBrowserGlobalErrorListeners(),
    provideRouter(routes),
    provideOptimus({ theme: { preset: Material } }),
    provideHttpClient(withInterceptors([authInterceptor, errorInterceptor])),
  ],
};
