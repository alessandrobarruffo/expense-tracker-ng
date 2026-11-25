import { Component, inject, signal } from '@angular/core';
import { Button } from '@openng/optimus-ui/button';
import { ExpensesStore } from '../../expenses.store';
import { Dialog } from '@openng/optimus-ui/dialog';
import { InputText } from '@openng/optimus-ui/inputtext';
import { Select } from '@openng/optimus-ui/select';

@Component({
  imports: [Button, Dialog, InputText, Select],
  selector: 'app-expenses-list.page',
  styleUrl: './expenses-list.page.scss',
  templateUrl: './expenses-list.page.html',
  providers: [ExpensesStore],
})
export class ExpensesListPage {
  expensesStore = inject(ExpensesStore);
  expenses = this.expensesStore.expenses;
  protected visible = signal<boolean>(false);

  constructor() {
    this.expensesStore.getExpenses();
  }
}
