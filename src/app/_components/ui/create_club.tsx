'use client';

import { Plus } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { BeatLoader } from 'react-spinners';
import classNames from 'classnames';
import toast from 'react-hot-toast';
import { useState } from 'react';

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
import { Button } from './button';
import { Input } from './input';
import { Textarea } from './textarea';
import { Separator } from './separator';

import { api } from '~/trpc/react';
import { clubSchema } from '~/schemas/club';
import { InferInput, InferOutput } from '~/lib/trpc';

const icons = ['default', 'grep', 'stank', 'shads'];

type Props = {
  onRefresh: () => void;
};

export const CreateClub = ({ onRefresh }: Props) => {
  const [open, setOpen] = useState(false);

  const onCreate = api.club.create.useMutation({
    onSuccess: (data) => {
      setOpen(false);
      onRefresh();
      form.reset({ description: '', icon: 'default', name: '' });
      toast.success('Clube'.concat(' ', data.name, ' ', 'foi criado'));
    },
    onError: (data) => toast.error(data.message),
  });

  const form = useForm<InferInput<'club', 'create'>>({
    mode: 'all',
    resolver: zodResolver(clubSchema.create),
    defaultValues: {
      icon: 'default',
    },
  });

  const {
    watch,
    formState: { isValid },
  } = form;

  const values = watch();

  return (
    <Sheet open={open} onOpenChange={(open) => setOpen(open)}>
      <SheetTrigger>
        <Button type="button" className="h-[50px] w-[50px] p-0">
          <Plus />
        </Button>
      </SheetTrigger>
      <SheetContent side="bottom">
        <SheetHeader>
          <SheetTitle className="text-start">Criar um novo clube</SheetTitle>
          <SheetDescription className="text-start">
            Para ler e discutir determinado texto/livro com um grupo.
          </SheetDescription>
        </SheetHeader>

        <div className="my-4">
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(() =>
                onCreate.mutate(form.getValues()),
              )}
              className="flex flex-col gap-2"
            >
              <Separator />

              <div className="my-4 flex w-full flex-row items-center justify-center gap-2">
                {icons.map((icon) => (
                  <img
                    key={icon}
                    onClick={() =>
                      form.setValue('icon', icon, { shouldValidate: true })
                    }
                    className={classNames(
                      'h-[70px] w-[70px] rounded-full border-4 border-solid object-cover',
                      values.icon == icon
                        ? 'border-primary'
                        : 'cursor-pointer border-transparent',
                    )}
                    src={'/assets'.concat('/', icon, '.', 'jpg')}
                    alt={icon}
                  />
                ))}
              </div>

              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Nome</FormLabel>
                    <FormControl>
                      <Input {...field} />
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
                    <FormLabel>Sobre</FormLabel>
                    <FormControl>
                      <Textarea
                        className="h-[80px]"
                        {...field}
                        maxLength={200}
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
                  'Salvar'
                )}
              </Button>
            </form>
          </Form>
        </div>
      </SheetContent>
    </Sheet>
  );
};
