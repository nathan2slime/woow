'use client';

import { CircleMinus, MoreVertical } from 'lucide-react';
import classNames from 'classnames';
import { useRouter } from 'next/navigation';

import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from '~/app/_components/ui/avatar';
import { Card } from '~/app/_components/ui/card';
import { getAvatarName } from '~/lib/utils';
import { Separator } from '~/app/_components/ui/separator';

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '~/app/_components/ui/dropdown-menu';
import { Badge } from '~/app/_components/ui/badge';
import { PersonIcon } from '@radix-ui/react-icons';

type Props = {
  name: string | null;
  image: string | null;
  id: string;
  isOwner: boolean;
  isManager: boolean;
};

export const CardMember = ({ isOwner, isManager, name, image, id }: Props) => {
  const router = useRouter();

  return (
    <Card
      className={classNames('flex items-center justify-between p-3', {
        'border-l-primary': isOwner && isManager,
      })}
    >
      <div
        onClick={() => router.push('/profile/'.concat(id))}
        className="flex h-full items-center gap-2"
      >
        <Avatar className="h-[40px] w-[40px]">
          <AvatarImage src={image ? image : 'default'} alt="@shadcn" />
          <AvatarFallback>
            {getAvatarName(name || 'US')!.toUpperCase()}
          </AvatarFallback>
        </Avatar>

        <Separator className="h-full" orientation="vertical" />

        <h4 className="text-sm">{name}</h4>
      </div>

      <div className="flex items-center gap-2">
        {isOwner && <Badge>Dono</Badge>}

        <DropdownMenu dir="ltr">
          <DropdownMenuTrigger>
            <MoreVertical className="w-4" />
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuItem
              onClick={() => router.push('/profile/'.concat(id))}
              className="flex items-center justify-start gap-2"
            >
              <PersonIcon className="w-4" />
              Perfil
            </DropdownMenuItem>

            {isManager && !isOwner && (
              <DropdownMenuItem className="flex items-center justify-start gap-2">
                <CircleMinus className="w-4 text-destructive" />
                Expulsar
              </DropdownMenuItem>
            )}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </Card>
  );
};
