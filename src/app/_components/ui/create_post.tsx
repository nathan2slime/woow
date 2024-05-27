'use client';

import { Plus } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { BeatLoader } from 'react-spinners';
import { toast } from 'react-hot-toast';
import { useEffect, useState } from 'react';
import { Club } from '@prisma/client';

import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from './sheet';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from './form';

import { api } from '~/trpc/react';
import { InferInput } from '~/lib/trpc';
import { Button } from '~/app/_components/ui/button';
import { Input } from '~/app/_components/ui/input';
import { Textarea } from '~/app/_components/ui/textarea';
import { postSchema } from '~/schemas/post';

type Props = {
  onRefresh: () => void;
  club: Club;
};

export const CreatePost = ({ onRefresh, club }: Props) => {
  const [open, setOpen] = useState(false);

  const onCreate = api.post.create.useMutation({
    onSuccess: (data) => {
      setOpen(false);
      onRefresh();
      form.reset({ title: '', description: '', club: club.id });
      toast.success('Publicação criada');
    },
    onError: (data) => toast.error(data.message),
  });

  const form = useForm<InferInput<'post', 'create'>>({
    mode: 'all',
    resolver: zodResolver(postSchema.create),
    defaultValues: {
      club: club.id,
    },
  });

  useEffect(() => {
    form.setValue('club', club.id, { shouldValidate: open });
  }, [open]);

  const {
    watch,
    formState: { isValid },
  } = form;

  const values = watch();

  const onSubmit = () => {
    const data = form.getValues();
    onCreate.mutate(data);
  };

  return (
    <Sheet open={open} onOpenChange={(open) => setOpen(open)}>
      <SheetTrigger>
        <Button type="button" className="h-[50px] w-[50px] p-0">
          <Plus />
        </Button>
      </SheetTrigger>
      <SheetContent side="bottom">
        <SheetHeader>
          <SheetTitle className="text-start">Nova publicação</SheetTitle>
          <SheetDescription className="text-start">
            Crie uma publicação para o clube {club.name}.
          </SheetDescription>
        </SheetHeader>

        <div className="my-4">
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(onSubmit)}
              className="flex flex-col gap-2"
            >
              <FormField
                control={form.control}
                name="title"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Título</FormLabel>
                    <FormControl>
                      <Input {...field} max={100} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Escrever</FormLabel>
                    <FormControl>
                      <Textarea
                        className="h-[80px]"
                        {...field}
                        maxLength={300}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <Button
                disabled={!isValid}
                className="ml-auto mt-6 w-full text-sm uppercase"
                type="submit"
              >
                {onCreate.isPending ? (
                  <BeatLoader size="10" color="white" />
                ) : (
                  'Publicar'
                )}
              </Button>
            </form>
          </Form>
        </div>
      </SheetContent>
    </Sheet>
  );
};
