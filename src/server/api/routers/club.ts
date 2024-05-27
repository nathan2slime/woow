import { User } from '@prisma/client';

import { clubSchema } from '~/schemas/club';
import {
  createTRPCRouter,
  authProcedure,
  publicProcedure,
} from '~/server/api/trpc';
import { findById } from '~/schemas/base';
import { TRPCError } from '@trpc/server';

export const clubRouter = createTRPCRouter({
  create: authProcedure
    .input(clubSchema.create)
    .mutation(async ({ ctx, input }) => {
      const user = ctx.session.user as User;

      return ctx.db.club.create({
        data: {
          ...input,
          owner: {
            connect: { id: user.id },
          },
        },
      });
    }),
  getMembers: authProcedure.input(findById).query(async ({ ctx, input }) => {
    const user = ctx.session.user as User;

    const club = await ctx.db.club.findUnique({
      select: {
        owner: {
          select: {
            name: true,
            image: true,
            id: true,
          },
        },
        users: {
          select: {
            user: {
              select: {
                id: true,
                name: true,
                image: true,
              },
            },
          },
        },
      },
      where: {
        id: input.id,
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
    });

    if (club) {
      const members = club.users.map(({ user }) => user);

      members.unshift(club.owner);

      return members;
    }

    throw new TRPCError({
      message: 'Club não tem membros',
      code: 'NOT_FOUND',
    });
  }),
  join: authProcedure.input(findById).mutation(async ({ ctx, input }) => {
    const user = ctx.session.user as User;

    const userClub = await ctx.db.userClub.findFirst({
      where: { clubId: input.id, userId: user.id },
    });

    const club = await ctx.db.club.findUnique({ where: { id: input.id } });

    if (!club)
      throw new TRPCError({
        code: 'NOT_FOUND',
        message: 'Club não existe',
      });

    if (userClub || club.userId == user.id)
      throw new TRPCError({
        code: 'CONFLICT',
        message: 'Você já entrou nesse club',
      });

    return ctx.db.userClub.create({
      data: {
        user: {
          connect: { id: user.id },
        },
        club: {
          connect: { id: input.id },
        },
      },
    });
  }),
  getByIdPublic: publicProcedure
    .input(findById)
    .mutation(async ({ ctx, input }) =>
      ctx.db.club.findUnique({ where: { id: input.id } }),
    ),
  getById: authProcedure.input(findById).query(async ({ ctx, input }) => {
    const user = ctx.session.user as User;

    return ctx.db.club.findUnique({
      include: {
        owner: {
          select: {
            id: true,
          },
        },
        _count: {
          select: {
            users: true,
          },
        },
      },
      where: {
        id: input.id,
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
    });
  }),
  my: authProcedure.query(async ({ ctx }) => {
    const user = ctx.session.user as User;

    return ctx.db.club.findMany({
      where: {
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
    });
  }),
});
