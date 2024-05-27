import { NextPage } from 'next';
import { User } from '@prisma/client';
import { redirect } from 'next/navigation';

import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from '~/app/_components/ui/avatar';
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '~/app/_components/ui/tabs';

import { getServerAuthSession } from '~/server/auth';
import { Separator } from '~/app/_components/ui/separator';
import { Profile } from '~/app/_components/ui/profile';
import { getAvatarName } from '~/lib/utils';
import { api } from '~/trpc/server';

type Props = {
  params: Record<string, string>;
};

const ProfilePage: NextPage<Props> = async ({ params }) => {
  const session = await getServerAuthSession();

  const user = (session && session.user) as User;
  const id = params.user as string;
  const isMe = id == 'me' || user.id == id;

  if (id == 'default') redirect('/profile/me');

  const profile = isMe ? user : await api.profile.getById({ id });

  if (!profile) redirect('/profile/me');

  return (
    <div className="flex h-fit w-full flex-col items-center px-4 pt-8">
      <Avatar className="h-[96px] w-[96px]">
        <AvatarImage src={profile.image || 'default'} alt="@shadcn" />
        <AvatarFallback>
          {getAvatarName(profile.name || 'US')!.toUpperCase()}
        </AvatarFallback>
      </Avatar>

      <h2 className="mb-4 mt-3 text-xl font-semibold text-primary-foreground">
        {profile.name}
      </h2>

      <Separator className="my-2" />

      <Tabs defaultValue="profile" className="mx-auto mt-2 w-full text-lg">
        <TabsList className="flex h-[60px] w-full flex-row overflow-x-auto">
          <TabsTrigger className="h-full w-full px-2" value="profile">
            Perfil
          </TabsTrigger>

          {isMe && (
            <TabsTrigger className="h-full w-full px-2" value="settings">
              Settings
            </TabsTrigger>
          )}
        </TabsList>
        <TabsContent value="profile">
          <Profile />
        </TabsContent>
        <TabsContent value="settings">Settings.</TabsContent>
      </Tabs>
    </div>
  );
};

export default ProfilePage;
