import { ChangeDetectionStrategy, Component, DestroyRef, inject, signal } from '@angular/core';
import { form, FormField } from '@angular/forms/signals';
import { LoginPayload } from '../model/login-model';
import { LoginService } from '../services/login.service';
import { tap } from 'rxjs';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  imports: [FormField],
  templateUrl: './login.html',
  styleUrl: './login.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class Login {

  loginModel = signal<LoginPayload>({
    username: '',
    password: ''
  });
  loginForm = form(this.loginModel);

  destroyRef = inject(DestroyRef);
  private router = inject(Router);
  private loginService = inject(LoginService);

  register() {
    this.loginService.register(this.loginForm().value())
      .pipe(takeUntilDestroyed(this.destroyRef), tap((response) => {
      })).subscribe();
  }

  login() {
    this.loginService.login(this.loginForm().value())
      .pipe(takeUntilDestroyed(this.destroyRef), tap((response) => {
        if (this.loginService.isLoggedIn()) {
          this.router.navigate(['/home']);
        }
      })).subscribe();
  }
}
