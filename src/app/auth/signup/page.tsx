'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import { BeatLoader } from 'react-spinners';
import { useRouter } from 'next/navigation';
import { signIn, useSession } from 'next-auth/react';

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '~/app/_components/ui/card';
import { Button } from '~/app/_components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '~/app/_components/ui/form';
import { Input } from '~/app/_components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '~/app/_components/ui/select';

import { authSchema } from '~/schemas/auth';
import { authState } from '~/store/auth.state';
import { api } from '~/trpc/react';
import { InferInput } from '~/lib/trpc';

const SignUp = () => {
  const router = useRouter();
  const session = useSession();

  const form = useForm<InferInput<'auth', 'signUp'>>({
    mode: 'all',
    resolver: zodResolver(authSchema.signUp),
  });

  const {
    formState: { isValid },
  } = form;

  const onSignUp = api.auth.signUp.useMutation({
    onSuccess: async (data) => {
      authState.user = data;
      await signIn('credentials', {
        callbackUrl: window.location.pathname,
        redirect: false,
        ...form.getValues(),
      });
      form.reset();

      authState.logged = true;
      window.location.reload();
    },
    onError: (data) => toast.error(data.message),
  });

  const [courses] = api.course.getAll.useSuspenseQuery();

  return (
    <Card className="mx-auto flex h-full  w-full  flex-shrink-0  flex-col justify-center rounded-none border-r border-none p-2 md:max-w-sm md:p-4">
      <CardHeader className="text-2xl">
        <CardTitle>Cadastro</CardTitle>
        <CardDescription>Crie uma conta</CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(() =>
              onSignUp.mutate(form.getValues()),
            )}
            className="flex flex-col gap-2"
          >
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Name</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>E-mail</FormLabel>
                  <FormControl>
                    <Input placeholder="exemplo@gmail.com" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Senha</FormLabel>
                  <FormControl>
                    <Input type="password" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="course"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Curso</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                    </FormControl>

                    <SelectContent>
                      {courses.map((course) => (
                        <SelectItem key={course.id} value={course.id}>
                          {course.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="mt-6 flex flex-col gap-2">
              <Button
                disabled={!isValid}
                className="ml-autow-full text-sm uppercase"
                type="submit"
              >
                {onSignUp.isPending ? (
                  <BeatLoader size="10" color="white" />
                ) : (
                  'Continuar'
                )}
              </Button>

              <Button
                type="button"
                onClick={() =>
                  signIn('discord', {
                    redirect: true,
                    callbackUrl: window.location.origin,
                  })
                }
                variant="outline"
                className="flex items-center gap-2 text-primary-foreground"
              >
                <svg className="h-[24px] w-[24px]" viewBox="0 0 24 24">
                  <path
                    d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0 12.64 12.64 0 0 0-.617-1.25.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 0 0 .031.057 19.9 19.9 0 0 0 5.993 3.03.078.078 0 0 0 .084-.028 14.09 14.09 0 0 0 1.226-1.994.076.076 0 0 0-.041-.106 13.107 13.107 0 0 1-1.872-.892.077.077 0 0 1-.008-.128 10.2 10.2 0 0 0 .372-.292.074.074 0 0 1 .077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127 12.299 12.299 0 0 1-1.873.892.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028 19.839 19.839 0 0 0 6.002-3.03.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.03zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.956-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.956 2.418-2.157 2.418zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.955-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.946 2.418-2.157 2.418Z"
                    fill="currentColor"
                  />
                </svg>
              </Button>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
};

export default SignUp;
