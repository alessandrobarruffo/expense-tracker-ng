import { inject, Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { LoginPayload } from '../model/login-model';
import { Observable } from 'rxjs';
import { Expense } from '../model/expense-model';
import { Page } from '../model/page-model';
import { TokenService } from './token-service';

@Injectable({
  providedIn: 'root',
})
export class ApiService {
  registerUrl = '/api/user/register';
  loginUrl = '/api/user/authenticate';
  logoutUrl = '/api/user/authenticate/logout';
  refreshUrl = '/api/user/authenticate/refresh';
  expenseUrl = '/api/expense';

  private http = inject(HttpClient);
  private tokenService = inject(TokenService);

  register(payload: LoginPayload) {
    return this.http.post(this.registerUrl, payload, { withCredentials: true });
  }

  login(payload: LoginPayload) {
    return this.http.post(this.loginUrl, payload, { observe: 'response' });
  }

  refresh() {
    return this.http.post(this.refreshUrl, {}, { observe: 'response' });
  }

  logout() {
    return this.http.post(this.logoutUrl, {});
  }

  getExpenses(): Observable<Page<Expense>> {
    return this.http.get<Page<Expense>>(this.expenseUrl, {
      headers: {
        Authorization: 'Bearer ' + this.tokenService.accessToken,
      },
    });
  }
}
