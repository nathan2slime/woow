import '~/styles/globals.scss';

import { Baloo_Tamma_2 } from 'next/font/google';

import { AuthProvider } from '~/app/_components/providers/auth';
import { RootProvider } from '~/app/_components/providers/root';
import { TRPCReactProvider } from '~/trpc/react';
import type { AppChildren } from '~/types';

export const metadata = {
  title: 'UniClub',
  icons: [{ rel: 'icon', url: '/favicon.ico' }],
};

const fonts = Baloo_Tamma_2({
  variable: '--font-sans',
  weight: ['600', '400', '500', '800', '700'],
  subsets: ['latin'],
});

export default ({ children }: AppChildren) => {
  return (
    <html lang="en" className={fonts.variable}>
      <body>
        <TRPCReactProvider>
          <RootProvider>
            <AuthProvider>{children}</AuthProvider>
          </RootProvider>
        </TRPCReactProvider>
      </body>
    </html>
  );
};
