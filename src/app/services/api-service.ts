import { inject, Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { LoginPayload } from '../model/login-model';

@Injectable({
  providedIn: 'root',
})
export class ApiService {
  registerUrl =  '/api/user/register';
  loginUrl =  '/api/user/authenticate';

  private http = inject(HttpClient);

  register(payload: LoginPayload) {
    return this.http.post(this.registerUrl, payload, { withCredentials: true});
  }

  login(payload: LoginPayload) {
    return this.http.post(this.loginUrl, payload, { observe: 'response' });
  }
}
