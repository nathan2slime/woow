'use client';

import { InferOutput } from '~/lib/trpc';
import { CreatePost } from '~/app/_components/ui/create_post';
import { CardPost } from '~/app/_components/ui/card_post';
import { api } from '~/trpc/react';

type Props = {
  club: InferOutput<'club', 'getById'>;
  posts: InferOutput<'post', 'getAll'>;
};

export const FeedPosts = ({ club, ...props }: Props) => {
  const postsQuery = api.post.getAll.useQuery({ club: club.id });

  const posts =
    postsQuery.isFetched && postsQuery.data ? postsQuery.data : props.posts;

  return (
    <div>
      <div className="mt-3 flex w-full items-center justify-between">
        <h2 className="text-xl font-semibold text-primary-foreground">Feed</h2>

        <CreatePost club={club} onRefresh={() => postsQuery.refetch()} />
      </div>

      <div className="mt-4 flex flex-col gap-1">
        {posts.length == 0 && (
          <p className="text-center text-base">Nenhuma publicação por aqui</p>
        )}
        {posts.map((post) => (
          <CardPost key={post.id} data={post} />
        ))}
      </div>
    </div>
  );
};
