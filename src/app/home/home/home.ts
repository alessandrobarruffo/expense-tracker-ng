import { Component, DestroyRef, inject, signal } from '@angular/core';
import { Button } from '@openng/optimus-ui/button';
import { AuthenticationService } from '../../services/authentication.service';
import { ApiService } from '../../services/api-service';
import { catchError, EMPTY, take, tap } from 'rxjs';
import { Expense } from '../../model/expense-model';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { Router, RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-home',
  imports: [Button, RouterOutlet],
  templateUrl: './home.html',
  styleUrl: './home.scss',
})
export class Home {
  expenses = signal<Expense[]>([]);

  private loginService = inject(AuthenticationService);
  private apiService = inject(ApiService);
  private destroyRef = inject(DestroyRef);
  private router = inject(Router);

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
    this.loginService
      .logout()
      .pipe(
        tap(() => {
          this.router.navigate(['login']);
        }),
        catchError(() => {
          //this.router.navigate(['/login']);
          return EMPTY;
        }),
      )
      .subscribe();
  }
}
