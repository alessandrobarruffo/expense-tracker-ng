import { Routes } from '@angular/router';
import { Login } from './core/features/auth/pages/login/login';
import { isLogged } from './core/features/auth/auth.guard';
import { MainLayout } from './core/layout/main-layout/main-layout';
import { ExpensesListPage } from './core/features/expenses/pages/expenses-list.page/expenses-list.page';

export const routes: Routes = [
  {
    path: '',
    component: MainLayout,
    canActivate: [isLogged],
    children: [
      {
        path: '',
        component: ExpensesListPage,
      },
    ],
  },
  { path: 'login', component: Login },
  { path: '**', redirectTo: '' },
];
