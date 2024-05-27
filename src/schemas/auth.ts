import { z } from 'zod';

export const signIn = z.object({
  email: z
    .string()
    .min(1)
    .email()
    .transform((arg) => arg.toLocaleLowerCase()),
  password: z.string().min(1),
});

export const signUp = z.object({
  email: z
    .string()
    .min(1)
    .email()
    .transform((arg) => arg.toLocaleLowerCase()),
  password: z.string().min(1),
  name: z.string().min(1),
  course: z.string().uuid(),
});

export const authSchema = { signIn, signUp };
