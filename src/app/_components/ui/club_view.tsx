import { formatRelative } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { User } from '@prisma/client';

import { Badge } from '~/app/_components/ui/badge';
import { Separator } from '~/app/_components/ui/separator';
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '~/app/_components/ui/tabs';
import { ClubMembers } from '~/app/_components/ui/club_members';
import { InferOutput } from '~/lib/trpc';
import { getServerAuthSession } from '~/server/auth';
import { api } from '~/trpc/server';
import { FeedPosts } from '~/app/_components/ui/feed_posts';

type Props = {
  club: InferOutput<'club', 'getById'>;
};

export const ClubView = async ({ club }: Props) => {
  const session = await getServerAuthSession();
  const members = await api.club.getMembers({ id: club.id });

  const user = (session && session.user) as User;

  const posts = await api.post.getAll({ club: club.id });

  return (
    <div className="mt-3 p-4">
      <div className="flex items-start justify-start gap-4">
        <img
          className="h-[90px] w-[90px] rounded-xl"
          src={'/assets/'.concat(club.icon).concat('.jpg')}
          alt={club.name}
        />

        <div className="flex flex-col items-start justify-start gap-2">
          <h2 className="break-words text-2xl font-bold">{club.name}</h2>

          <p className="text-md">
            Criado&nbsp;
            {formatRelative(club.createdAt, new Date(), { locale: ptBR })}
          </p>

          <Badge variant="secondary">{club._count.users + 1} membros</Badge>
        </div>
      </div>

      <p className="mt-5 break-words text-base">{club.description}</p>

      <div>
        <Separator className="my-4" />

        <Tabs defaultValue="general" className="mx-auto mt-2 w-full text-lg">
          <TabsList className="flex h-[60px] w-full flex-row overflow-x-auto">
            <TabsTrigger className="h-full w-full px-2" value="general">
              Geral
            </TabsTrigger>
            <TabsTrigger className="h-full w-full px-2" value="members">
              Membros
            </TabsTrigger>

            <TabsTrigger className="h-full w-full px-2" value="config">
              Config
            </TabsTrigger>
          </TabsList>
          <TabsContent value="members">
            <ClubMembers
              user={user}
              members={members}
              owner={club.owner.id}
              id={club.id}
            />
          </TabsContent>
          <TabsContent value="general">
            <FeedPosts club={club} posts={posts} />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};
