'use client';

import { expenseTrackingActions } from '@/actions';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableFooter, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { cn } from '@/lib/utils';
import { EditEmployeeExpensesSchema } from '@/schemas';
import { EditEmployeeExpenseFormProps } from '@/types/props';
import { zodResolver } from '@hookform/resolvers/zod';
import { PaymentStatus as PaymentStatusEnum, PaymentType as PaymentTypeEnum } from '@prisma/client';
import { ExclamationTriangleIcon } from '@radix-ui/react-icons';
import { CalendarIcon, CheckCircledIcon, Cross1Icon, PlusCircledIcon, TrashIcon } from '@radix-ui/react-icons';
import { format } from 'date-fns';
import { useState, useTransition } from 'react';
import { SubmitHandler, useFieldArray, useForm } from 'react-hook-form';
import { z } from 'zod';

export function EditEmployeeExpenseForm({ expenses, items, suppliers, employees }: EditEmployeeExpenseFormProps) {
  const [isPending, startTransition] = useTransition();
  const [formResponse, setFormResponse] = useState<
    | {
        success?: {
          message: string;
        };
      }
    | {
        error?: {
          message: string;
        };
      }
    | undefined
  >(undefined);
  const form = useForm<z.infer<typeof EditEmployeeExpensesSchema>>({
    resolver: zodResolver(EditEmployeeExpensesSchema),
    defaultValues: {
      records: expenses.map((expense) => ({
        id: expense.id,
        tranDate: expense.transactionDate,
        itemId: expense.itemId,
        supplierId: expense.supplierId,
        employeeId: expense.employeeId,
        quantity: expense.quantity,
        amount: expense.amount,
        invoice: expense.invoice,
        paymentType: expense.paymentType,
        paymentStatus: expense.paymentStatus,
        comment: expense.comments || '',
        reviewed: expense.reviewed || false,
        accepted: expense.accepted || false,
        createdAt: expense.createdAt,
        updatedAt: expense.updatedAt,
      })),
    },
  });

  const formArray = useFieldArray({ control: form.control, name: 'records' });

  const onSubmit: SubmitHandler<z.infer<typeof EditEmployeeExpensesSchema>> = (formData) => {
    startTransition(() => {
      expenseTrackingActions
        .EditExpense(formData)
        .then((data) => {
          setFormResponse(data);
        })
        .then(() => {
          form.reset();
          form.reset();
        })
        .then(() => {
          setTimeout(() => {
            setFormResponse(undefined); // Clearing formResponse after 3 seconds
          }, 2000); // Timeout set to 3 seconds (3000 milliseconds)
        });
    });
  };

  const rejectAll = () => {
    startTransition(() => {
      formArray.fields.forEach((_, index) => {
        form.setValue(`records.${index}.reviewed`, true);
        form.setValue(`records.${index}.accepted`, false);
      });
    });
  };

  const acceptAll = () => {
    startTransition(() => {
      formArray.fields.forEach((_, index) => {
        form.setValue(`records.${index}.reviewed`, true);
        form.setValue(`records.${index}.accepted`, true);
      });
    });
  };

  return (
    <div className="space-y-6 p-6 bg-white rounded-lg shadow-md">
      <h1 className="text-2xl font-semibold text-center text-gray-800">Review Expenses</h1>
      <p className="text-gray-600 text-center">
        Following expenses have not been reviewed. Please review them and click on save.
        <br />
        You can also make adjustments to these expenses
      </p>
      <div className="mt-4">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <div className="flex flex-col gap-4 items-start">
              <Table className="min-w-full bg-white border border-gray-300">
                <TableHeader>
                  <TableRow className="bg-gray-300 ">
                    {[
                      'Date',
                      'Supplier',
                      'Item',
                      'Quantity',
                      'Amount',
                      'Invoice',
                      'Method',
                      'Status',
                      'Comments',
                      'Approve',
                    ].map((header, index) => (
                      <TableHead
                        key={index}
                        className="px-6 py-3 text-left text-xs font-medium text-gray-800 uppercase tracking-wider border border-gray-300"
                      >
                        {header}
                      </TableHead>
                    ))}
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {formArray.fields.map((row, index) => (
                    <TableRow key={row.id}>
                      <TableCell>
                        <FormField
                          control={form.control}
                          name={`records.${index}.tranDate`}
                          render={({ field }) => (
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
                      </TableCell>
                      <TableCell>
                        <div className="pt-2">
                          <FormField
                            control={form.control}
                            name={`records.${index}.supplierId`}
                            render={({ field }) => (
                              <FormItem>
                                <Select onValueChange={field.onChange} defaultValue={String(field.value)}>
                                  <FormControl>
                                    <SelectTrigger className="bg-gray-100">
                                      <SelectValue>
                                        {suppliers.find((supplier) => supplier.id === field.value)?.name ||
                                          'select supplier'}
                                      </SelectValue>
                                    </SelectTrigger>
                                  </FormControl>
                                  <SelectContent>
                                    {suppliers.map((supplier, index) => (
                                      <SelectItem key={index} value={supplier.id}>
                                        {supplier.name}
                                      </SelectItem>
                                    ))}
                                  </SelectContent>
                                </Select>
                                <FormDescription />
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="pt-2">
                          <FormField
                            control={form.control}
                            name={`records.${index}.itemId`}
                            render={({ field }) => (
                              <FormItem>
                                <Select onValueChange={field.onChange} defaultValue={String(field.value)}>
                                  <FormControl>
                                    <SelectTrigger className="bg-gray-100">
                                      <SelectValue>
                                        {items.find((item) => item.id === field.value)?.name || 'select item'}
                                      </SelectValue>
                                    </SelectTrigger>
                                  </FormControl>
                                  <SelectContent>
                                    {items.map((item, index) => (
                                      <SelectItem key={index} value={item.id}>
                                        {item.name}
                                      </SelectItem>
                                    ))}
                                  </SelectContent>
                                </Select>
                                <FormDescription />
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                        </div>
                      </TableCell>
                      <TableCell>
                        <FormField
                          control={form.control}
                          name={`records.${index}.quantity`}
                          render={({ field }) => (
                            <FormItem>
                              <FormControl>
                                <Input
                                  type="number"
                                  placeholder="0"
                                  {...field}
                                  onChange={(event) => field.onChange(+event.target.value)}
                                  min="1"
                                  className="w-[100px] bg-gray-100"
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </TableCell>
                      <TableCell>
                        <FormField
                          control={form.control}
                          name={`records.${index}.amount`}
                          render={({ field }) => (
                            <FormItem>
                              <FormControl>
                                <Input
                                  type="number"
                                  placeholder="0"
                                  {...field}
                                  onChange={(event) => field.onChange(+event.target.value)}
                                  min="1"
                                  className="w-[100px] bg-gray-100"
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </TableCell>
                      <TableCell>
                        <FormField
                          control={form.control}
                          name={`records.${index}.invoice`}
                          render={({ field }) => (
                            <FormItem>
                              <FormControl>
                                <Input
                                  type="number"
                                  placeholder="0"
                                  {...field}
                                  onChange={(event) => field.onChange(+event.target.value)}
                                  min="1"
                                  className="w-[100px] bg-gray-100"
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </TableCell>
                      <TableCell>
                        <FormField
                          control={form.control}
                          name={`records.${index}.paymentType`}
                          render={({ field }) => (
                            <FormItem>
                              <FormControl>
                                <Select onValueChange={field.onChange} defaultValue={String(field.value)}>
                                  <SelectTrigger className="bg-gray-100">
                                    <SelectValue>
                                      {Object.keys(PaymentTypeEnum).find(
                                        (key) => PaymentTypeEnum[key as keyof typeof PaymentTypeEnum] === field.value,
                                      )}
                                    </SelectValue>
                                  </SelectTrigger>
                                  <SelectContent>
                                    {Object.keys(PaymentTypeEnum).map((key, index) => (
                                      <SelectItem
                                        key={index}
                                        value={PaymentTypeEnum[key as keyof typeof PaymentTypeEnum]}
                                      >
                                        {PaymentTypeEnum[key as keyof typeof PaymentTypeEnum]}
                                      </SelectItem>
                                    ))}
                                  </SelectContent>
                                </Select>
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </TableCell>
                      <TableCell>
                        <FormField
                          control={form.control}
                          name={`records.${index}.paymentStatus`}
                          render={({ field }) => (
                            <FormItem>
                              <FormControl>
                                <Select onValueChange={field.onChange} defaultValue={String(field.value)}>
                                  <SelectTrigger className="bg-gray-100">
                                    <SelectValue>
                                      {Object.keys(PaymentStatusEnum).find(
                                        (key) =>
                                          PaymentStatusEnum[key as keyof typeof PaymentStatusEnum] === field.value,
                                      )}
                                    </SelectValue>
                                  </SelectTrigger>
                                  <SelectContent>
                                    {Object.keys(PaymentStatusEnum).map((key, index) => (
                                      <SelectItem
                                        key={index}
                                        value={PaymentStatusEnum[key as keyof typeof PaymentStatusEnum]}
                                      >
                                        {PaymentStatusEnum[key as keyof typeof PaymentStatusEnum]}
                                      </SelectItem>
                                    ))}
                                  </SelectContent>
                                </Select>
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </TableCell>
                      <TableCell>
                        <FormField
                          control={form.control}
                          name={`records.${index}.comment`}
                          render={({ field }) => (
                            <FormItem>
                              <FormControl>
                                <Input
                                  type="text"
                                  placeholder="Add comment"
                                  {...field}
                                  onChange={(event) => field.onChange(event.target.value)}
                                  className="w-[100px] bg-gray-100"
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </TableCell>
                      <TableCell>
                        <div className="flex justify-center gap-2">
                          <Button
                            onClick={() => {
                              startTransition(() => {
                                form.setValue(`records.${index}.reviewed`, true);
                                form.setValue(`records.${index}.accepted`, false);
                              });
                            }}
                            variant="outline"
                            className="text-red-400"
                          >
                            <Cross1Icon className="h-5 w-5" />
                          </Button>
                          <Button
                            onClick={() => {
                              startTransition(() => {
                                form.setValue(`records.${index}.reviewed`, true);
                                form.setValue(`records.${index}.accepted`, true);
                              });
                            }}
                            variant="outline"
                            className="text-green-400"
                          >
                            <CheckCircledIcon className="h-5 w-5" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
                <TableFooter>
                  <TableRow>
                    <TableCell
                      colSpan={10}
                      className="text-sm font-medium text-gray-800 uppercase tracking-wider border border-gray-300 "
                    >
                      <div className=" flex flex-row gap-3">
                        <Button
                          onClick={rejectAll}
                          type="button"
                          className="flex justify-center items-center gap-2"
                          variant="destructive"
                        >
                          <span>Reject all</span> <TrashIcon />
                        </Button>
                        <Button
                          onClick={acceptAll}
                          type="button"
                          className="flex justify-center items-center gap-2"
                          variant="outline"
                        >
                          <span> Accept all</span>
                          <CheckCircledIcon />
                        </Button>
                        <Button type="submit" className="inline-flex">
                          Save
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                </TableFooter>
              </Table>
              <div className="w-full flex justify-center items-center">
                {formResponse && 'success' in formResponse && (
                  <FormMessage className="bg-green-100 border border-green-300 shadow-md text-green-800 text-xs flex justify-center items-center py-1 px-2 rounded-md gap-2 min-w-[180px]">
                    <CheckCircledIcon className="text-green-500 h-4 w-4" />
                    <span>{formResponse.success?.message}</span>
                  </FormMessage>
                )}

                {formResponse && 'error' in formResponse && (
                  <FormMessage className="bg-red-100 border border-red-300 shadow-md text-red-800 text-xs flex justify-center items-center py-1 px-2 rounded-md gap-2 min-w-[180px]">
                    <ExclamationTriangleIcon className="text-red-500 h-4 w-4" />
                    <span>{formResponse.error?.message}</span>
                  </FormMessage>
                )}
              </div>
            </div>
          </form>
        </Form>
      </div>
    </div>
  );
}
