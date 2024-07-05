'use client';

import { expenseTrackingActions } from '@/actions';
import { Form } from '@/components/ui/form';
import { ExpenseByDaySchema } from '@/schemas';
import { zodResolver } from '@hookform/resolvers/zod';
import { useTransition } from 'react';
import { SubmitHandler, useForm } from 'react-hook-form';
import { z } from 'zod';

export function DailyExpenseForm() {
  const [isPending, startTransition] = useTransition();

  const form = useForm<z.infer<typeof ExpenseByDaySchema>>({
    resolver: zodResolver(ExpenseByDaySchema),
    defaultValues: {
      tranDate: '20240703',
    },
  });

  const onSubmit: SubmitHandler<z.infer<typeof ExpenseByDaySchema>> = (formData) => {
    startTransition(() => {
      expenseTrackingActions.getExpensesByDay(formData);
    });
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)}></form>
    </Form>
  );
}
