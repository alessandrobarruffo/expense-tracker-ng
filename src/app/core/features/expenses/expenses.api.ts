import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Expense } from '../../../model/expense-model';
import { Page } from '../../../model/page-model';
import { authStore } from '../../auth/auth.store';

@Injectable({
  providedIn: 'root',
})
export class ExpensesApi {
  expenseUrl = '/api/expense';

  private http = inject(HttpClient);
  private authenticationSate = inject(authStore);

  getExpenses(): Observable<Page<Expense>> {
    return this.http.get<Page<Expense>>(this.expenseUrl, {
      headers: {
        Authorization: 'Bearer ' + this.authenticationSate.accessToken(),
      },
    });
  }
}
