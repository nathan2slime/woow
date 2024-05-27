import { User } from '@prisma/client';
import { proxy } from 'valtio';

export type AuthState = {
  user: Omit<User, 'password'> | undefined;
  logged: boolean;
};

export const authState = proxy<AuthState>({
  logged: false,
  user: undefined,
});
