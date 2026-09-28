import { HttpErrorResponse, HttpInterceptorFn } from '@angular/common/http';
import { catchError, EMPTY, of, throwError } from 'rxjs';
import { ErrorCode, ErrorResponse } from '../model/error-model';

const noToastRoutes = ['/api/user/register', '/api/user/login'];

export const errorInterceptor: HttpInterceptorFn = (req, next) => {
  return next(req).pipe(
    catchError((errorResponse: HttpErrorResponse) => {
      console.log(errorResponse);
      const body = errorResponse.error as Partial<ErrorResponse> | null;

      const fallback: ErrorResponse = {
        code: errorResponse.status as any,
        message: errorResponse.message,
        requestId: '',
        timestamp: new Date().toISOString(),
      };

      const error: ErrorResponse = body?.message ? { ...fallback, ...body } : fallback;

      return throwError(() => error);
    }),
  );
};
