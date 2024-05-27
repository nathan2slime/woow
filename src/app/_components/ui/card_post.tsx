import { Card } from '~/app/_components/ui/card';
import { InferOutput } from '~/lib/trpc';
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from '~/app/_components/ui/avatar';
import { getAvatarName } from '~/lib/utils';
import { formatRelative } from 'date-fns';

type Props = {
  data: InferOutput<'post', 'getAll'>[0];
};

export const CardPost = ({ data }: Props) => {
  return (
    <Card className="p-4">
      <div className="mb-2 flex w-full items-center justify-between">
        <div className="flex items-center justify-start gap-2 text-sm text-muted-foreground">
          <Avatar className="h-[30px] w-[30px]">
            <AvatarImage src={data.user.image || 'default'} alt="@shadcn" />
            <AvatarFallback>
              {getAvatarName(data.user.name || 'US')!.toUpperCase()}
            </AvatarFallback>
          </Avatar>

          {data.user.name}
        </div>

        <div className="flex items-center justify-end gap-2">
          <span className="text-sm text-muted-foreground">
            {formatRelative(data.createdAt, new Date())}
          </span>
        </div>
      </div>
      <div>
        <h1 className="line-clamp-1 break-all text-lg font-semibold">
          {data.title}
        </h1>

        <p className="line-clamp-1 break-all text-base">{data.description}</p>
      </div>
    </Card>
  );
};
