import { Prisma, User } from '@prisma/client';

import {
  authProcedure,
  clubMiddleware,
  createTRPCRouter,
} from '~/server/api/trpc';
import { postSchema } from '~/schemas/post';
import SortOrder = Prisma.SortOrder;

export const postRouter = createTRPCRouter({
  create: authProcedure
    .input(postSchema.create)
    .use(clubMiddleware)
    .mutation(async ({ ctx, input }) => {
      const user = (ctx.session && ctx.session.user) as User;

      return ctx.db.post.create({
        data: {
          ...input,
          club: {
            connect: { id: input.club },
          },
          user: { connect: { id: user.id } },
        },
      });
    }),
  getAll: authProcedure
    .input(postSchema.club)
    .use(clubMiddleware)
    .query(async ({ ctx, input }) => {
      return ctx.db.post.findMany({
        where: {
          club: {
            id: input.club,
          },
        },
        orderBy: {
          createdAt: SortOrder.desc,
        },
        include: {
          user: {
            select: {
              name: true,
              id: true,
              image: true,
            },
          },
        },
      });
    }),
});
