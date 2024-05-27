'use client';

import { Toaster } from 'react-hot-toast';
import { SessionProvider } from 'next-auth/react';

import { toasterOptions } from '~/lib/utils';
import { AppChildren } from '~/types';

export const RootProvider = ({ children }: AppChildren) => {
  return (
    <SessionProvider>
      <div className="relative flex h-dvh w-screen flex-col overflow-hidden">
        <Toaster toastOptions={toasterOptions} />

        {children}
      </div>
    </SessionProvider>
  );
};
