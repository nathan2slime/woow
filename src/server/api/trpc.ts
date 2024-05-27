import { initTRPC, TRPCError } from '@trpc/server';
import superjson from 'superjson';
import { z, ZodError } from 'zod';

import { getServerAuthSession } from '~/server/auth';
import { db } from '~/server/db';

export const createTRPCContext = async (opts: { headers: Headers }) => {
  const session = await getServerAuthSession();

  return {
    db,
    session,
    ...opts,
  };
};

const t = initTRPC.context<typeof createTRPCContext>().create({
  transformer: superjson,
  errorFormatter({ shape, error }) {
    return {
      ...shape,
      data: {
        ...shape.data,
        zodError:
          error.cause instanceof ZodError ? error.cause.flatten() : null,
      },
    };
  },
});

export const createCallerFactory = t.createCallerFactory;

export const createTRPCRouter = t.router;

export const publicProcedure = t.procedure;

export const authProcedure = t.procedure.use(({ ctx, next }) => {
  if (!ctx.session || !ctx.session.user)
    throw new TRPCError({ code: 'UNAUTHORIZED' });

  return next({
    ctx: {
      session: { ...ctx.session, user: ctx.session.user },
    },
  });
});

export const clubMiddleware = t.middleware(async ({ ctx, next, ...opt }) => {
  const input = opt.input as Record<string, string>;
  const hasClub = Object.keys(input).includes('club');

  if (ctx.session && hasClub && input.club) {
    const clubId = z.string().uuid().safeParse(input.club);
    if (clubId.success) {
      const user = ctx.session.user;

      const club = await ctx.db.club.findUnique({
        where: {
          id: clubId.data,
          OR: [
            {
              owner: {
                id: user.id,
              },
            },
            {
              users: {
                some: {
                  user: {
                    id: user.id,
                  },
                },
              },
            },
          ],
        },
        select: { id: true },
      });

      if (club) return next({ ctx, input });
    }
  }

  throw new TRPCError({ code: 'UNAUTHORIZED' });
});

export const protectedClubMiddleware = t.middleware(
  async ({ ctx, next, ...opt }) => {
    const input = opt.input as Record<string, string>;
    const hasClub = Object.keys(input).includes('club');

    if (ctx.session && hasClub && input.club) {
      const clubId = z.string().uuid().safeParse(input.club);

      if (clubId.success) {
        const user = ctx.session.user;

        const club = await ctx.db.club.findUnique({
          where: {
            id: clubId.data,
            owner: {
              id: user.id,
            },
          },
          select: { id: true },
        });

        if (club) return next({ ctx, input });
      }
    }

    throw new TRPCError({ code: 'UNAUTHORIZED' });
  },
);
