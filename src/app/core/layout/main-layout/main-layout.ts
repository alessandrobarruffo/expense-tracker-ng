import { Component, inject } from '@angular/core';
import { Button } from '@openng/optimus-ui/button';
import { RouterOutlet } from '@angular/router';
import { AuthStore } from '../../features/auth/auth.store';

@Component({
  imports: [Button, RouterOutlet],
  selector: 'app-main-layout',
  styleUrl: './main-layout.scss',
  templateUrl: './main-layout.html',
})
export class MainLayout {

  authStore = inject(AuthStore);

  logout() {
    this.authStore.logout();
  }
}
