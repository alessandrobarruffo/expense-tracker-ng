import { patchState, signalStore, withMethods, withState } from '@ngrx/signals';
import { Expense } from './expenses.model';
import { rxMethod } from '@ngrx/signals/rxjs-interop';
import { catchError, EMPTY, pipe, switchMap, tap } from 'rxjs';
import { inject } from '@angular/core';
import { ExpensesApi } from './expenses.api';

type ExpensesStore = {
  expenses: Expense[];
  loading: boolean;
  page: number;
  total: number;
}

const expensesState : ExpensesStore = {
  expenses: [],
  loading: false,
  page: 0,
  total: 0,
}


export const ExpensesStore = signalStore(
  withState(expensesState),
  withMethods((store, expensesApi = inject(ExpensesApi) ) => ({
    getExpenses: rxMethod<void>(
      pipe(
        tap(() => {
          patchState(store, {loading: true})
        }),
        switchMap(() => expensesApi.getExpenses().pipe(
          tap(expensesPage => {
            patchState(store, {expenses: expensesPage.content, total: expensesPage.totalCount, loading: false});
          }),
          catchError(() => {
            patchState(store, {
              loading: false
            })
            return EMPTY;
          })
        )),
      ))

  }))
)
