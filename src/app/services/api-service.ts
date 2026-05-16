import { inject, Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { LoginPayload } from '../model/login-model';

@Injectable({
  providedIn: 'root',
})
export class ApiService {

  registerUrl = environment.apiUrl + '/user/register';
  loginUrl = environment.apiUrl + '/user/authenticate';

  private http = inject(HttpClient);

  register(payload: LoginPayload) {
    return this.http.post(this.registerUrl, payload);
  }

  login(payload: LoginPayload) {
    return this.http.post(this.loginUrl, payload, { observe: 'response' });
  }
}
