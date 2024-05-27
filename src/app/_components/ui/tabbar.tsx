'use client';

import { Book, Compass, Home, User } from 'lucide-react';
import { usePathname } from 'next/navigation';
import classNames from 'classnames';
import Link from 'next/link';

import { Button } from './button';
import { Card } from './card';

const iconStyle = {
  color: 'white',
  width: 24,
};

export const TabBar = () => {
  const pathname = usePathname();

  const itens = [
    {
      path: '/',
      icon: {
        active: <Home {...iconStyle} fill="white" strokeWidth={0} />,
        default: <Home {...iconStyle} />,
      },
      title: 'Home',
    },
    {
      path: '/explore',
      icon: {
        active: <Compass {...iconStyle} fill="white" strokeWidth={0} />,
        default: <Compass {...iconStyle} />,
      },
      title: 'Explorar',
    },
    {
      path: '/library',
      icon: {
        active: <Book {...iconStyle} fill="white" strokeWidth={0} />,
        default: <Book {...iconStyle} />,
      },
      title: 'Biblioteca',
    },
    {
      path: '/profile/me',
      icon: {
        active: <User strokeWidth={0} fill="white" {...iconStyle} />,
        default: <User {...iconStyle} />,
      },
      title: 'Conta',
    },
  ];

  return (
    <Card className="flex h-[85px] w-full gap-2 rounded-none border-x-0 border-b-0 border-t p-2">
      {itens.map(({ title, icon, path }) => {
        const active = path == pathname;

        return (
          <Link key={path} className="w-full" href={path}>
            <Button
              variant="ghost"
              className={classNames(
                'flex h-full w-full flex-col gap-1 p-0 text-xs',
                active ? 'bg-[#573848]  fill-primary' : 'bg-transparent',
              )}
            >
              {active ? icon.active : icon.default}

              {title}
            </Button>
          </Link>
        );
      })}
    </Card>
  );
};
