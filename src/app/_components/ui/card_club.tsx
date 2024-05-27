'use client';

import { Club } from '@prisma/client';
import { formatRelative } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { useRouter } from 'next/navigation';

type Props = {
  data: Club;
};

export const CardClub = ({ data }: Props) => {
  const router = useRouter();

  return (
    <div
      onClick={() => router.push('/club'.concat('/').concat(data.id))}
      className="flex w-full justify-start gap-4 rounded-lg bg-[#2d1f26] p-2"
    >
      <img
        className="h-[80px] w-[80px] rounded-md object-cover"
        src={'/assets'.concat('/', data.icon, '.', 'jpg')}
        alt={data.name}
      />
      <div className="gap-2">
        <h1 className="break-words text-base font-semibold">{data.name}</h1>
        <p className="mt-2  line-clamp-1 break-all text-sm text-accent-foreground">
          {data.description}
        </p>

        <p className="italicm mr-auto mt-1 text-sm text-accent-foreground">
          Entrou&nbsp;
          {formatRelative(data.createdAt, new Date(), { locale: ptBR })}
        </p>
      </div>
    </div>
  );
};
