import { Injectable, signal } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class TokenService {
  private _accessToken = signal<string | null>(null);

  get accessToken(): string | null {
    return this._accessToken();
  }

  set accessToken(accessToken: string | null) {
    this._accessToken.set(accessToken);
  }

  constructor() {}
}
