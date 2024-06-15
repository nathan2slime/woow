import { redirect } from 'next/navigation';

import { api } from '~/trpc/server';

import { FeedClubs } from '~/app/_components/ui/feed_clubs';
import { getServerAuthSession } from '~/server/auth';

const Home = async () => {
  const session = await getServerAuthSession();

  if (!session) redirect('/auth/sining');

  const clubs = await api.club.my();

  return <FeedClubs clubs={clubs} />;
};

export default Home;
