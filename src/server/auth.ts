import { PrismaAdapter } from '@auth/prisma-adapter';
import {
  type DefaultSession,
  getServerSession,
  type NextAuthOptions,
} from 'next-auth';
import { type Adapter } from 'next-auth/adapters';
import DiscordProvider from 'next-auth/providers/discord';
import CredentialsProvider from 'next-auth/providers/credentials';
import { User } from '@prisma/client';
import { compare } from 'bcryptjs';

import { env } from '~/env';
import { db, exclude } from '~/server/db';

declare module 'next-auth' {
  interface Session extends DefaultSession {
    user: {
      id: string;
    } & DefaultSession['user'] &
      User;
  }
}

export const authOptions: NextAuthOptions = {
  pages: {
    signIn: '/',
    error: '/',
    newUser: '/',
    signOut: '/',
    verifyRequest: '/',
  },
  callbacks: {
    session: async ({ session, token, ...params }) => {
      const user = await db.user.findUnique({ where: { id: token.sub } });

      return {
        ...session,
        user: {
          ...(user ? exclude<User, 'password'>(user, ['password']) : {}),
          id: token.sub,
        },
      };
    },
    jwt: (params) => {
      return { ...params.token, ...params.user };
    },
  },
  adapter: PrismaAdapter(db) as Adapter,
  secret: env.NEXTAUTH_SECRET,
  session: { strategy: 'jwt' },
  providers: [
    DiscordProvider({
      clientId: env.DISCORD_CLIENT_ID,
      clientSecret: env.DISCORD_CLIENT_SECRET,
    }),
    CredentialsProvider({
      credentials: {
        email: { type: 'email' },
        password: { type: 'password' },
      },
      type: 'credentials',
      async authorize(credentials, req) {
        const payload = req.query &&
          credentials && {
            email: credentials.email || req.query.email,
            password: credentials.password || req.query.password,
          };

        if (payload) {
          const user = await db.user.findUnique({
            where: { email: payload.email },
          });

          if (!user || !user.password) return null;

          const match = compare(payload.password, user.password);
          if (!match) return null;

          if (user) return exclude<User, 'password'>(user, ['password']);
        }

        return null;
      },
    }),
  ],
};

export const getServerAuthSession = () => getServerSession(authOptions);
