import { inject, Injectable } from '@angular/core';
import { LoginPayload } from '../model/login-model';
import { ApiService } from './api-service';
import {  switchMap, tap } from 'rxjs';
import { TokenService } from './token-service';

@Injectable({
  providedIn: 'root',
})
export class AuthenticationService {
  private apiService = inject(ApiService);
  private tokenService = inject(TokenService);

  register(registerPayload: LoginPayload) {
    return this.apiService
      .register(registerPayload)
      .pipe(switchMap(() => this.login(registerPayload)));
  }

  login(loginPayload: LoginPayload) {
    return this.apiService.login(loginPayload).pipe(
      tap((response) => {
        if (response.status === 200) {
          this.tokenService.accessToken = response.headers.get('Authorization');
        }
      }),
    );
  }

  refresh() {
    return this.apiService.refresh().pipe(
      tap((response) => {
        if (response.status === 200) {
          this.tokenService.accessToken = response.headers.get('Authorization');
        }
      }),
    );
  }

  isLoggedIn() {
    return this.tokenService.accessToken !== null;
  }

  logout() {
    return this.apiService.logout().pipe(
      tap(() => {
        this.tokenService.accessToken = null;
      }),
    );
  }
}
