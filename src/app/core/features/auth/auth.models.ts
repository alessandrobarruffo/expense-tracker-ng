export interface LoginRequestDto {
  username: string;
  password: string;
}

export type AuthStoreLoginPayload = LoginRequestDto & {returnUrl?: string};

export type User = Omit<LoginRequestDto, 'password'> & { accessToken: string };
