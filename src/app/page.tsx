import { api } from '~/trpc/server';

import { FeedClubs } from '~/app/_components/ui/feed_clubs';

const Home = async () => {
  const clubs = await api.club.my();

  return <FeedClubs clubs={clubs} />;
};

export default Home;
