import { ApplicationConfig, provideBrowserGlobalErrorListeners } from '@angular/core';
import { provideRouter } from '@angular/router';

import { routes } from './app.routes';
import { provideOptimus } from '@openng/optimus-ui/config';
import Material from '@openng/optimus-ui-themes/material';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { errorInterceptor } from './interceptors';

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideRouter(routes),
    provideOptimus({ theme: { preset: Material } }),
    provideHttpClient(withInterceptors([errorInterceptor]))
  ],
};
