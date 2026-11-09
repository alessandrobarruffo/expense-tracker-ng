import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map, Observable } from 'rxjs';
import { Expense, ExpenseDto } from './expenses.model';
import { Page, PageDto, toPage } from '../../model/page.model';
import { AuthStore } from '../auth/auth.store';

@Injectable({
  providedIn: 'root',
})
export class ExpensesApi {
  expenseUrl = '/api/expense';

  private http = inject(HttpClient);
  private authenticationSate = inject(AuthStore);

  getExpenses(): Observable<Page<Expense>> {
    return this.http
      .get<PageDto<ExpenseDto>>(this.expenseUrl)
      .pipe(
        map((p) =>
          toPage({
            ...p,
            content: p.content.map((expenseDto: ExpenseDto) => toExpense(expenseDto)),
          }),
        ),
      );
  }
}

const toExpense = (expenseDto: ExpenseDto): Expense => {
  return {
    id: expenseDto.id,
    price: expenseDto.price,
    expenseDate: expenseDto.expense_date,
  };
};
