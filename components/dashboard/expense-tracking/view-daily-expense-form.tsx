'use client';

import { expenseTrackingActions } from '@/actions';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { Form, FormControl, FormDescription, FormField, FormItem, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableFooter, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { cn } from '@/lib/utils';
import { DailyExpenseSchema } from '@/schemas';
import { DailyExpenseFormProps } from '@/types/props';
import { zodResolver } from '@hookform/resolvers/zod';
import { CalendarIcon, MagnifyingGlassIcon } from '@radix-ui/react-icons';
import { format } from 'date-fns';
import { useTransition } from 'react';
import { SubmitHandler, useForm } from 'react-hook-form';
import { z } from 'zod';

import { ExpenseTable } from './expense-table';

export function DailyExpenseForm({ expenses }: DailyExpenseFormProps) {
  const [isPending, startTransition] = useTransition();

  const form = useForm<z.infer<typeof DailyExpenseSchema>>({
    resolver: zodResolver(DailyExpenseSchema),
    defaultValues: {
      tranDate: expenses[0].tranDate,
    },
  });

  const onSubmit: SubmitHandler<z.infer<typeof DailyExpenseSchema>> = (formData) => {
    startTransition(() => {
      expenseTrackingActions.getDailyExpenses(formData);
    });
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)}>
        <div className="flex justify-end gap-4">
          <FormField
            control={form.control}
            name={'tranDate'}
            render={({ field }) => (
              // "flex flex-col gap-2 justify-end line-through text-destructive"
              <FormItem className="flex flex-col gap-2 justify-end">
                <Popover>
                  <PopoverTrigger asChild>
                    <FormControl>
                      <Button
                        variant="outline"
                        className={cn(
                          'w-full pl-3 text-left font-normal bg-gray-100 gap-3',
                          !field.value && 'text-muted-foreground',
                        )}
                      >
                        {field.value ? format(field.value, 'PPP') : <span>Pick a date</span>}
                        <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                      </Button>
                    </FormControl>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0">
                    <Calendar
                      mode="single"
                      selected={field.value}
                      onSelect={field.onChange}
                      disabled={(date) => date > new Date() || date < new Date('1900-01-01')}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button type="submit">
            <MagnifyingGlassIcon />
          </Button>
        </div>
        <div>
          <ExpenseTable data={expenses} />
        </div>
      </form>
    </Form>
  );
}
