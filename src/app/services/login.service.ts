import { inject, Injectable, signal } from '@angular/core';
import { LoginPayload } from '../model/login-model';
import { ApiService } from './api-service';
import { map } from 'rxjs';

@Injectable({
    providedIn: 'root',
})
export class LoginService {

    private _acessToken = signal<string | null>(null);
    private apiService = inject(ApiService);

    get acessToken(): string | null {
        return this._acessToken();
    }

    set accessToken(value: string | null) {
        this._acessToken.set(value);
    }


    register(registerPayload: LoginPayload) {
        return this.apiService.register(registerPayload);
    }

    login(loginPayload: LoginPayload) {
        return this.apiService.login(loginPayload).pipe(map(response => {
            if (response.status === 200) {
                const token = response.headers.get('Authorization');
                this._acessToken.set(token);
            }
            return response;
        }));
    }

    isLoggedIn() {
        return this._acessToken() !== null;
    }

    logout() {
        this._acessToken.set(null);
    }

}
