'use client';

import { registerActions } from '@/actions';
import { Button } from '@/components/ui/button';
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { RegisterSchema } from '@/schemas/register-schema';
import { zodResolver } from '@hookform/resolvers/zod';
import { useTransition } from 'react';
import { SubmitHandler, useForm, useWatch } from 'react-hook-form';
import { z } from 'zod';

export function RegisterForm() {
  const [isPending, startTransition] = useTransition();

  const registerForm = useForm<z.infer<typeof RegisterSchema>>({
    resolver: zodResolver(RegisterSchema),
    defaultValues: {
      name: '',
      email: '',
      password: '',
    },
  });

  const email = useWatch({ control: registerForm.control, name: 'email' });
  const username = useWatch({ control: registerForm.control, name: 'name' });
  const password = useWatch({ control: registerForm.control, name: 'password' });

  const onSubmit: SubmitHandler<z.infer<typeof RegisterSchema>> = (formData) => {
    startTransition(() => {
      registerActions.login(formData);
    });
  };

  return (
    <Form {...registerForm}>
      <form onSubmit={registerForm.handleSubmit(onSubmit)} className="space-y-6 md:w-[368px]">
        <FormField
          control={registerForm.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Username</FormLabel>
              <FormControl>
                <Input placeholder="eg:johndoe" {...field} type="text" autoComplete="off" />
              </FormControl>
              <FormDescription>This will be your public display name.</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={registerForm.control}
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
          control={registerForm.control}
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
        <Button
          type="submit"
          className="w-full"
          disabled={username.length < 6 || email.length < 10 || password.length < 8 || isPending}
        >
          Register
        </Button>
      </form>
    </Form>
  );
}
