import { HttpInterceptorFn } from '@angular/common/http';
import { catchError, EMPTY, switchMap, throwError } from 'rxjs';
import { inject } from '@angular/core';
import { AuthenticationService } from '../services/authentication.service';
import { TokenService } from '../services/token-service';
import { ApiService } from '../services/api-service';
import { Router } from '@angular/router';

export const refreshTokenInterceptor: HttpInterceptorFn = (req, next) => {
  const authenticationService = inject(AuthenticationService);
  const tokenService = inject(TokenService);
  const apiService = inject(ApiService);
  const router = inject(Router);
  return next(req).pipe(
    catchError((errorResponse) => {
      if (
        errorResponse.status === 401 &&
        !req.url.includes(apiService.refreshUrl) &&
        !req.url.includes(apiService.logoutUrl)
      ) {
        return authenticationService.refresh().pipe(
          switchMap(() => {
            const newReq = req.clone({
              headers: req.headers.set('Authorization', 'Bearer ' + tokenService.accessToken),
            });
            return next(newReq);
          }),
          catchError(() => {
            router.navigate(['/login']);
            return EMPTY;
          }),
        );
      }
      return throwError(() => errorResponse);
    }),
  );
};
