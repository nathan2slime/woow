import { headers } from 'next/headers';
import { redirect } from 'next/navigation';

import { AppChildren } from '~/types';
import { Header } from '~/app/_components/ui/header';
import { TabBar } from '~/app/_components/ui/tabbar';
import { getServerAuthSession } from '~/server/auth';

type Props = {} & AppChildren;

export const AuthProvider = async ({ children }: Props) => {
  const session = await getServerAuthSession();
  const header = headers();

  const pathname = header.get('x-pathname') || '';
  const isAuth = pathname.includes('auth');

  if (!session && !isAuth) redirect('/auth/signin');

  if (isAuth && session) redirect('/');

  return (
    <div className="h-full w-full">
      {isAuth ? (
        children
      ) : (
        <div className="h-full w-full">
          <Header />

          <div className="h-[calc(100%-175px)] w-full overflow-x-hidden overscroll-y-auto">
            {children}
          </div>

          <TabBar />
        </div>
      )}
    </div>
  );
};
