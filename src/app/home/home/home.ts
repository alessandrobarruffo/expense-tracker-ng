import { Component, DestroyRef, inject, signal } from '@angular/core';
import { Button } from '@openng/optimus-ui/button';
import { take, tap } from 'rxjs';
import { Expense } from '../../model/expense-model';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { RouterOutlet } from '@angular/router';
import { ExpensesApi } from '../../core/features/expenses/expenses.api';
import { authStore } from '../../core/auth/auth.store';

@Component({
  selector: 'app-home',
  imports: [Button, RouterOutlet],
  templateUrl: './home.html',
  styleUrl: './home.scss',
})
export class Home {
  expenses = signal<Expense[]>([]);

  authenticationStore = inject(authStore);
  private apiService = inject(ExpensesApi);
  private destroyRef = inject(DestroyRef);

  constructor() {
    this.getExpenses();
  }

  getExpenses() {
    this.apiService
      .getExpenses()
      .pipe(
        take(1),
        takeUntilDestroyed(this.destroyRef),
        tap((expensePage) => {
          this.expenses.set(expensePage.content);
        }),
      )
      .subscribe();
  }

  logout() {
    this.authenticationStore.logout();
  }
}
