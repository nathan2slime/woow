import { User } from '@prisma/client';

import { api } from '~/trpc/server';
import { CardMember } from '~/app/_components/ui/card_member';
import { getServerAuthSession } from '~/server/auth';
import { InferOutput } from '~/lib/trpc';

type Props = {
  id: string;
  owner: string;
  members: InferOutput<'club', 'getMembers'>;
  user: User;
};

export const ClubMembers = async ({ id, owner, members, user }: Props) => {
  return (
    <div className="flex flex-col gap-1 pt-3">
      {members.map((member) => {
        const isManager = owner == user.id;
        const isOwner = member.id == owner;

        return (
          <CardMember
            isOwner={isOwner}
            isManager={isManager}
            key={member.id}
            {...member}
          />
        );
      })}
    </div>
  );
};
