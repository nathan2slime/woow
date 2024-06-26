import { createCallerFactory, createTRPCRouter } from '~/server/api/trpc';
import { authRouter } from '~/server/api/routers/auth';
import { courseRouter } from '~/server/api/routers/course';
import { clubRouter } from '~/server/api/routers/club';
import { profileRouter } from '~/server/api/routers/profile';
import { postRouter } from '~/server/api/routers/post';
import { searchRouter } from '~/server/api/routers/search';

export const appRouter = createTRPCRouter({
  auth: authRouter,
  course: courseRouter,
  club: clubRouter,
  post: postRouter,
  profile: profileRouter,
  search: searchRouter,
});

export type AppRouter = typeof appRouter;

export const createCaller = createCallerFactory(appRouter);
