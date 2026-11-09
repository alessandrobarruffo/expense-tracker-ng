import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { LoginRequestDto, User } from './auth.models';

@Injectable({
  providedIn: 'root',
})
export class AuthApi {
  registerUrl = '/api/user/register';
  loginUrl = '/api/user/authenticate';
  logoutUrl = '/api/user/authenticate/logout';
  refreshUrl = '/api/user/authenticate/refresh';

  private http = inject(HttpClient);

  register(payload: LoginRequestDto) {
    return this.http.post<void>(this.registerUrl, payload, { withCredentials: true });
  }

  login(payload: LoginRequestDto) {
    return this.http.post<User>(this.loginUrl, payload, { observe: 'response' });
  }

  refresh() {
    return this.http.post<User>(this.refreshUrl, {}, { observe: 'response' });
  }

  logout() {
    return this.http.post(this.logoutUrl, {});
  }
}
