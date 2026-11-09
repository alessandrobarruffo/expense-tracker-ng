import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Expense } from './expenses.model';
import { Page } from '../../model/page-model';
import { AuthStore } from '../auth/auth.store';

@Injectable({
  providedIn: 'root',
})
export class ExpensesApi {
  expenseUrl = '/api/expense';

  private http = inject(HttpClient);
  private authenticationSate = inject(AuthStore);

  getExpenses(): Observable<Page<Expense>> {
    return this.http.get<Page<Expense>>(this.expenseUrl, {
      headers: {
        Authorization: 'Bearer ' + this.authenticationSate.accessToken(),
      },
    });
  }
}
