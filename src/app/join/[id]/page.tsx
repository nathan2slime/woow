import { redirect } from 'next/navigation';
import { TRPCError } from '@trpc/server';
import { EnterIcon } from '@radix-ui/react-icons';
import { ChevronLeft } from 'lucide-react';
import Link from 'next/link';

import { Card } from '~/app/_components/ui/card';
import { api } from '~/trpc/server';
import { Button } from '~/app/_components/ui/button';

type Props = {
  params: Record<string, string>;
};

export default async ({ params }: Props) => {
  const id = params.id as string;
  if (!id) redirect('/');

  const club = await api.club.getByIdPublic({ id });
  if (!club) redirect('/');

  const onJoin = async () => {
    'use server';

    try {
      await api.club.join({ id });
    } catch (e) {
      if (e instanceof TRPCError) {
        if (e.code == 'NOT_FOUND') redirect('/');
        if (e.code == 'CONFLICT') redirect('/club/'.concat(id));
      }
    }
  };

  return (
    <div className="flex h-full items-center justify-center p-4">
      <Card className="relative flex min-h-[350px] w-full flex-col items-center justify-between gap-2 border-0 p-6">
        <img
          className="absolute top-[-45px] h-[90px] w-[90px] rounded-xl"
          src={'/assets/'.concat(club.icon).concat('.jpg')}
          alt={club.name}
        />
        <div>
          <h2 className="mb-2 pt-[48px] text-center text-2xl font-semibold text-primary-foreground">
            {club.name}
          </h2>

          <p className="text-center text-base">{club.description}</p>
        </div>

        <form action={onJoin} className="mb-4 flex w-full max-w-[80%] gap-3">
          <Link className="w-full" href="/">
            <Button
              type="button"
              variant="outline"
              className="flex w-full items-center gap-2 font-semibold uppercase"
            >
              <ChevronLeft />
              Voltar
            </Button>
          </Link>
          <Button className="flex w-full items-center gap-2 font-semibold uppercase">
            Entrar <EnterIcon />
          </Button>
        </form>
      </Card>
    </div>
  );
};
