import { LoginRequestDto, AuthStoreLoginPayload, User } from './auth.models';
import { patchState, signalStore, withComputed, withMethods, withState } from '@ngrx/signals';
import { rxMethod } from '@ngrx/signals/rxjs-interop';
import { catchError, EMPTY, finalize, Observable, pipe, switchMap, tap } from 'rxjs';
import { AuthApi } from './auth.api';
import { computed, inject } from '@angular/core';
import { Router } from '@angular/router';
import { ErrorResponse } from '../../model/error.model';
import { HttpResponse } from '@angular/common/http';

type AuthState = {
  user: User | null;
  accessToken: string | null;
  error: ErrorResponse | null;
};

const initialState: AuthState = {
  user: null,
  accessToken: null,
  error: null,
};

export const AuthStore = signalStore(
  { providedIn: 'root' },
  withState(initialState),
  withComputed(({ accessToken }) => ({
    isLoggedIn: computed(() => !!accessToken()),
  })),
  withMethods((store, authApi = inject(AuthApi), router = inject(Router)) => {
    const createSessionMethod = (
      request: (payload: LoginRequestDto) => Observable<HttpResponse<User>>,
    ) =>
      rxMethod<AuthStoreLoginPayload>(
        pipe(
          tap(() => patchState(store, { error: null })),
          switchMap((payload) => {
            const { returnUrl, ...apiPayload } = payload;
            return request(apiPayload).pipe(
              tap((res) => {
                patchState(store, {
                  user: res.body,
                  accessToken: res.headers.get('Authorization'),
                });
                void router.navigateByUrl(returnUrl ?? 'home');
              }),
              catchError((error: ErrorResponse) => {
                patchState(store, { error });
                return EMPTY;
              }),
            );
          }),
        ),
      );
    return {
      login: createSessionMethod((payload: LoginRequestDto) => authApi.login(payload)),
      register: createSessionMethod((payload: LoginRequestDto) =>
        authApi.register(payload).pipe(switchMap(() => authApi.login(payload))),
      ),
      refresh: () => {
        return authApi.refresh().pipe(
          tap((userResponse) => {
            patchState(store, {
              user: userResponse.body,
              accessToken: userResponse.headers.get('Authorization'),
            });
          }),
          catchError(() => {
            return EMPTY;
          }),
        );
      },
      logout: rxMethod<void>(
        switchMap(() =>
          authApi.logout().pipe(
            finalize(() => {
              patchState(store, initialState);
              void router.navigate(['login']);
            }),
          ),
        ),
      ),
    };
  }),
);
