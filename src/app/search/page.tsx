import { api } from '~/trpc/server';
import { Data, DataType } from '~/server/api/routers/search';

type Props = {
  searchParams: Record<string, string>;
};
export default async ({ searchParams }: Props) => {
  const query = searchParams.query as string;
  const posts = await api.search.general({ query });

  return (
    <div>
      {posts.map((e) => {
        if (e.type == DataType.BOOK) {
          const data = e.data as Data[DataType.BOOK];

          return (
            <div>
              <img src={data.coverImage} />
            </div>
          );
        }
        return <div></div>;
      })}
    </div>
  );
};
