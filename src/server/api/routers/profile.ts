import { User } from '@prisma/client';
import { TRPCError } from '@trpc/server';

import { createTRPCRouter, authProcedure } from '~/server/api/trpc';
import { findById } from '~/schemas/base';
import { exclude } from '~/server/db';

export const profileRouter = createTRPCRouter({
  getById: authProcedure.input(findById).query(async ({ ctx, input }) => {
    const user = await ctx.db.user.findUnique({ where: { id: input.id } });

    if (user) return exclude<User, 'password'>(user, ['password']);

    throw new TRPCError({ code: 'NOT_FOUND', message: 'Perfil não existe' });
  }),
});
