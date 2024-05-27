import { TRPCError } from '@trpc/server';
import { compare, hash } from 'bcryptjs';
import { User } from '@prisma/client';

import {
  createTRPCRouter,
  authProcedure,
  publicProcedure,
} from '~/server/api/trpc';

import { signIn, signUp } from '~/schemas/auth';
import { exclude } from '~/server/db';

export const authRouter = createTRPCRouter({
  signIn: publicProcedure.input(signIn).mutation(async ({ ctx, input }) => {
    const user = await ctx.db.user.findUnique({
      where: { email: input.email },
    });

    if (!user || !user.password)
      throw new TRPCError({
        message: 'Email not exists',
        code: 'BAD_REQUEST',
      });

    const match = compare(input.password, user.password);

    if (!match)
      throw new TRPCError({
        message: 'Password mismatch',
        code: 'BAD_REQUEST',
      });

    return exclude<User, 'password'>(user, ['password']);
  }),
  check: authProcedure.mutation(async ({ ctx }) => ctx.session),
  signUp: publicProcedure.input(signUp).mutation(async ({ ctx, input }) => {
    const userAlreadyExists = await ctx.db.user.findUnique({
      where: { email: input.email },
    });

    if (userAlreadyExists)
      throw new TRPCError({
        message: 'E-mail already exists',
        code: 'BAD_REQUEST',
      });

    const password = await hash(input.password, 10);

    const course = await ctx.db.course.findUnique({
      where: { id: input.course },
    });

    if (!course)
      throw new TRPCError({
        message: 'Course not exists',
        code: 'BAD_REQUEST',
      });

    const user = await ctx.db.user.create({
      data: { ...input, course: { connect: { id: input.course } }, password },
    });

    return exclude<User, 'password'>(user, ['password']);
  }),
});
