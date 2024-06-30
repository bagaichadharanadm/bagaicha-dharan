'use client';

import { loginActions } from '@/actions';
import { Button } from '@/components/ui/button';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { LoginSchema } from '@/schemas/login-schema';
import { zodResolver } from '@hookform/resolvers/zod';
import { ExclamationTriangleIcon } from '@radix-ui/react-icons';
import { useEffect, useState, useTransition } from 'react';
import { SubmitHandler, useForm, useWatch } from 'react-hook-form';
import { z } from 'zod';

export function LoginForm() {
  const [formResponseError, setFormResponseError] = useState<{
    error:
      | {
          error: string;
        }
      | undefined;
  }>({ error: undefined });
  const [isPending, startTransition] = useTransition();

  const loginForm = useForm<z.infer<typeof LoginSchema>>({
    resolver: zodResolver(LoginSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  });

  useEffect(() => {
    if (loginForm.formState.isSubmitSuccessful) {
      loginForm.reset();
    }
  }, [loginForm.formState.isSubmitSuccessful]);

  const email = useWatch({ control: loginForm.control, name: 'email' });
  const password = useWatch({ control: loginForm.control, name: 'password' });

  const onSubmit: SubmitHandler<z.infer<typeof LoginSchema>> = (formData) => {
    startTransition(() => {
      loginActions.login(formData).then((error) => {
        setFormResponseError({ error });
      });
    });
  };

  return (
    <Form {...loginForm}>
      <form onSubmit={loginForm.handleSubmit(onSubmit)} className="space-y-6 md:w-[368px]">
        <FormField
          control={loginForm.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email Address</FormLabel>
              <FormControl>
                <Input placeholder="eg:johndoe@gmail.com" {...field} type="email" autoComplete="off" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={loginForm.control}
          name="password"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Password</FormLabel>
              <FormControl>
                <Input placeholder="******" {...field} type="password" autoComplete="new-password" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        {formResponseError.error && (
          <FormMessage className="bg-destructive-foreground/95 p-2 rounded-md border border-red-300 flex justify-center items-center space-x-4">
            <ExclamationTriangleIcon />
            <span>{formResponseError.error.error}</span>
          </FormMessage>
        )}
        <Button type="submit" className="w-full" disabled={email.length < 10 || password.length < 8 || isPending}>
          Login
        </Button>
      </form>
    </Form>
  );
}
