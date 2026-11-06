import { Routes } from '@angular/router';
import { Login } from './login/login';
import { Home } from './home/home/home';
import { isLogged } from './core/auth/auth.guard';
import { Expenses } from './home/home/expenses/expenses';

export const routes: Routes = [
  {
    path: 'expenses',
    component: Home,
    canActivate: [isLogged],
    children: [
      {
        path: '',
        component: Expenses,
      },
    ],
  },
  { path: 'login', component: Login },
  { path: '**', redirectTo: 'expenses' },
];
