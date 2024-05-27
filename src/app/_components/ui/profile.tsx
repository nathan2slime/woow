'use client';

import { signOut } from 'next-auth/react';
import { useRouter } from 'next/navigation';

import { Button } from '~/app/_components/ui/button';

export const Profile = () => {
  const router = useRouter();

  const onSignOut = async () => {
    await signOut();

    router.push('/auth/signin');
  };

  return (
    <div>
      <Button onClick={() => onSignOut()}>Sair</Button>
      Make changes to your account here.
    </div>
  );
};
