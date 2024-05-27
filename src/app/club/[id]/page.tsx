import { redirect } from 'next/navigation';

import { api } from '~/trpc/server';
import { ClubView } from '~/app/_components/ui/club_view';

type Props = {
  params: Record<string, string>;
};

export default async ({ params }: Props) => {
  const id = params.id;

  if (!id) return redirect('/');

  const club = await api.club.getById({ id });

  if (!club) return redirect('/');

  return <ClubView club={club} />;
};
