import { Component, inject } from '@angular/core';
import { Button } from '@openng/optimus-ui/button';
import { ExpensesStore } from '../../expenses.store';

@Component({
  imports: [Button],
  selector: 'app-expenses-list.page',
  styleUrl: './expenses-list.page.scss',
  templateUrl: './expenses-list.page.html',
  providers: [ExpensesStore],
})
export class ExpensesListPage {
  expensesStore = inject(ExpensesStore);
  expenses = this.expensesStore.expenses;

  constructor() {
    this.expensesStore.getExpenses();
  }
}
