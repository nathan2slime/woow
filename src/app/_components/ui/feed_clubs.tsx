'use client';

import { Club } from '@prisma/client';

import { CreateClub } from '~/app/_components/ui/create_club';
import { Separator } from '~/app/_components/ui/separator';
import { CardClub } from '~/app/_components/ui/card_club';
import { api } from '~/trpc/react';

type Props = {
  clubs: Club[];
};

export const FeedClubs = (props: Props) => {
  const clubs = api.club.my.useQuery();

  const onRefresh = async () => {
    await clubs.refetch();
  };

  const isFetched = clubs.isFetched && clubs.data;

  return (
    <div className="h-fit w-full">
      <header className="mt-3 flex w-full items-center justify-between px-4 py-4">
        <h3 className="text-xl font-bold text-primary">Meus clubes</h3>

        <CreateClub onRefresh={onRefresh} />
      </header>

      <Separator />

      <div className="flex flex-col gap-2 p-4">
        {(isFetched ? clubs.data : props.clubs).map((e) => (
          <CardClub data={e} key={e.id} />
        ))}
      </div>
    </div>
  );
};
