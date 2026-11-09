import { HttpInterceptorFn } from '@angular/common/http';
import { catchError, EMPTY, switchMap, throwError } from 'rxjs';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { AuthApi } from './auth.api';
import { AuthStore } from './auth.store';

const notAuthenticatedRoutes = ['register', 'login'];
export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const authStore = inject(AuthStore);
  const apiService = inject(AuthApi);
  const router = inject(Router);
  const shouldAddAuthHeader = authStore.isLoggedIn() && notAuthenticatedRoutes.every((notAuthenticatedRoute) => !req.url.includes(notAuthenticatedRoute));
  return next(shouldAddAuthHeader ? req.clone({
    headers: req.headers.set('Authorization', 'Bearer ' + authStore.accessToken()),
  }) : req).pipe(
    catchError((errorResponse) => {
      if (
        errorResponse.status === 401 &&
        !req.url.includes(apiService.refreshUrl) &&
        !req.url.includes(apiService.logoutUrl)
      ) {
        return authStore.refresh().pipe(
          switchMap((userResponse) => {
            const newReq = req.clone({
              headers: req.headers.set('Authorization', 'Bearer ' + userResponse.body?.accessToken),
            });
            return next(newReq);
          }),
          catchError(() => {
            void router.navigate(['/login']);
            return EMPTY;
          }),
        );
      }
      return throwError(() => errorResponse);
    }),
  );
};
