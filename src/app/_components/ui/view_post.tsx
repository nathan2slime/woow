import { InferOutput } from '~/lib/trpc';

type Props = {
  data: InferOutput<'post', 'getAll'>;
};

export const ViewPost = ({}: Props) => {
  return <div></div>;
};
