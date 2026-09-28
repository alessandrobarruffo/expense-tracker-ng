import {
  Component,
  DestroyRef,
  inject,
  signal,
} from '@angular/core';
import { form, FormField, required } from '@angular/forms/signals';
import { LoginPayload } from '../model/login-model';
import { LoginService } from '../services/login.service';
import { catchError, EMPTY, tap } from 'rxjs';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { Router } from '@angular/router';
import { Button } from '@openng/optimus-ui/button';
import { InputTextModule } from '@openng/optimus-ui/inputtext';
import { MessageModule } from '@openng/optimus-ui/message';
import { HttpErrorResponse } from '@angular/common/http';
import { ErrorResponse } from '../model/error-model';


@Component({
  selector: 'app-login',
  imports: [FormField, Button, InputTextModule, MessageModule],
  templateUrl: './login.html',
  styleUrl: './login.scss'
})
export class Login {

  loginModel = signal<LoginPayload>({
    username: '',
    password: '',
  });
  loginForm = form(this.loginModel, (schemaPath) => {
    required(schemaPath.username);
    required(schemaPath.password);
  });
  error = signal<ErrorResponse | null>(null);

  destroyRef = inject(DestroyRef);
  private router = inject(Router);
  private loginService = inject(LoginService);

  constructor() {}

  register() {
    this.error.set(null);
    this.loginService
      .register(this.loginForm().value())
      .pipe(
        takeUntilDestroyed(this.destroyRef),
        tap((res) => {
          console.log(res);
        }),
        catchError((error: ErrorResponse) => {
            console.error(error);
            this.error.set(error);
            return EMPTY;
        })
      )
      .subscribe();
  }

  login() {
    this.error.set(null);
    this.loginService
      .login(this.loginForm().value())
      .pipe(
        takeUntilDestroyed(this.destroyRef),
        tap((response) => {
          if (this.loginService.isLoggedIn()) {
            this.router.navigate(['/home']);
          }
        }),
        catchError((error: ErrorResponse) => {
          this.error.set(error);
          return EMPTY;
        })
      )
      .subscribe();
  }
}
