export interface AuthPayload {
  username: string;
  password: string;
}

export type User = Omit<AuthPayload, 'password'> & { accessToken: string };
