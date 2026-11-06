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
import { errorInterceptor } from './interceptors';
import { authInterceptor } from './core/auth/auth.interceptor';
import { authStore } from './core/auth/auth.store';

export const appConfig: ApplicationConfig = {
  providers: [
    provideAppInitializer(() => {
      return inject(authStore).refresh();
    }),
    provideBrowserGlobalErrorListeners(),
    provideRouter(routes),
    provideOptimus({ theme: { preset: Material } }),
    provideHttpClient(withInterceptors([authInterceptor, errorInterceptor])),
  ],
};
