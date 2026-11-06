import { Component, inject, signal } from '@angular/core';
import { form, FormField, required } from '@angular/forms/signals';
import { Button } from '@openng/optimus-ui/button';
import { InputTextModule } from '@openng/optimus-ui/inputtext';
import { MessageModule } from '@openng/optimus-ui/message';
import { AuthPayload } from '../core/auth/auth.models';
import { authStore } from '../core/auth/auth.store';

@Component({
  selector: 'app-login',
  imports: [FormField, Button, InputTextModule, MessageModule],
  templateUrl: './login.html',
  styleUrl: './login.scss',
})
export class Login {
  loginModel = signal<AuthPayload>({
    username: '',
    password: '',
  });
  loginForm = form(this.loginModel, (schemaPath) => {
    required(schemaPath.username);
    required(schemaPath.password);
  });
  authStore = inject(authStore);
  error = this.authStore.error;

  constructor() {}

  register() {
    this.authStore.register(this.loginForm().value());
  }

  login() {
    this.authStore.login(this.loginForm().value());
  }
}
