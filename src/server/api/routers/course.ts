import { createTRPCRouter, publicProcedure } from '~/server/api/trpc';

export const courseRouter = createTRPCRouter({
  getAll: publicProcedure.query(async ({ ctx }) => ctx.db.course.findMany({})),
});
