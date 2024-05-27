import { PrismaClient } from '@prisma/client';

import { env } from '~/env';

const createPrismaClient = () =>
  new PrismaClient({
    log:
      env.NODE_ENV === 'development' ? ['query', 'error', 'warn'] : ['error'],
  });

const globalForPrisma = globalThis as unknown as {
  prisma: ReturnType<typeof createPrismaClient> | undefined;
};

export const db = globalForPrisma.prisma ?? createPrismaClient();

if (env.NODE_ENV !== 'production') globalForPrisma.prisma = db;

export const exclude = <T extends {}, Key extends keyof T>(
  data: T,
  keys: Key[],
) =>
  Object.fromEntries(
    Object.entries(data).filter(([key]) => {
      return !keys.includes(key as Key) && data[key as Key] != null;
    }),
  ) as Omit<T, Key>;
