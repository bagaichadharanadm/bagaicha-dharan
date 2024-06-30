'use client';

import { expenseTrackingActions } from '@/actions';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { Form, FormControl, FormDescription, FormField, FormItem, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableFooter, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { formatDate } from '@/lib/format-date';
import { cn } from '@/lib/utils';
import { CreateExpenseSchema, CreateExpensesSchema } from '@/schemas';
import { zodResolver } from '@hookform/resolvers/zod';
import { PaymentStatus as PaymentStatusEnum, PaymentType as PaymentTypeEnum } from '@prisma/client';
import { CalendarIcon, TrashIcon } from '@radix-ui/react-icons';
import { format } from 'date-fns';
import { useTransition } from 'react';
import { SubmitHandler, useFieldArray, useForm } from 'react-hook-form';
import { z } from 'zod';

export function CreateExpenseForm() {
  const [isPending, startTransition] = useTransition();

  const inputForm = useForm<z.infer<typeof CreateExpenseSchema>>({
    resolver: zodResolver(CreateExpenseSchema),
    defaultValues: {
      tranDate: new Date(),
      itemId: '',
      supplierId: '',
      employeeId: '',
      quantity: 1,
      amount: 1,
      invoice: 1,
      paymentType: 'CASH',
      paymentStatus: 'PAID',
      invoiceAmount: 1,
      comment: '',
    },
  });

  const form = useForm<z.infer<typeof CreateExpensesSchema>>({
    resolver: zodResolver(CreateExpensesSchema),
    defaultValues: { records: [] },
  });

  const formArray = useFieldArray({ name: 'records', control: form.control });

  const append = () => {
    startTransition(() => {
      console.log(formArray.fields);
      formArray.append({
        tranDate: inputForm.watch('tranDate'),
        itemId: inputForm.watch('itemId'),
        supplierId: inputForm.watch('supplierId'),
        employeeId: inputForm.watch('employeeId'),
        quantity: inputForm.watch('quantity'),
        amount: inputForm.watch('amount'),
        invoice: inputForm.watch('invoice'),
        paymentType: inputForm.watch('paymentType'),
        paymentStatus: inputForm.watch('paymentStatus'),
        invoiceAmount: inputForm.watch('invoiceAmount'),
        comment: inputForm.watch('comment'),
      });
    });
    inputForm.resetField('quantity');
    inputForm.resetField('amount');
    inputForm.resetField('invoice');
  };

  const FormTableCell = ({ children }: { children: React.ReactNode }) => {
    return (
      <TableCell className="px-2 py-1 whitespace-nowrap text-sm text-gray-500 border border-gray-300">
        {children}
      </TableCell>
    );
  };

  const ExpenseLogForm = () => {
    return (
      <Form {...inputForm}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <div className="flex flex-col gap-4 items-end">
            <Table className="min-w-full bg-white border border-gray-300">
              <TableHeader>
                <TableRow className="bg-gray-200">
                  {['Date', 'Supplier', 'Item', 'Quantity', 'Amount', 'Invoice', 'Method', 'Status', 'Actions'].map(
                    (header, index) => {
                      return (
                        <TableHead
                          key={index}
                          className="px-6 py-3 text-left text-xs font-medium text-gray-800 uppercase tracking-wider border border-gray-300"
                        >
                          {header}
                        </TableHead>
                      );
                    },
                  )}
                </TableRow>
              </TableHeader>
              <TableBody>
                {form.watch('records').map((row, index) => (
                  <TableRow key={index} className={index % 2 === 0 ? 'bg-slate-300' : 'bg-slate-400'}>
                    {[
                      { content: formatDate(row.tranDate) },
                      { content: row.supplierId },
                      { content: row.itemId },
                      { content: row.quantity },
                      { content: row.amount },
                      { content: row.invoice },
                      { content: row.paymentType },
                      { content: row.paymentStatus },
                      {
                        content: (
                          <Button
                            variant={'destructive'}
                            className="flex gap-4 justify-center items-center w-full"
                            onClick={() => {
                              startTransition(() => {
                                formArray.remove(index);
                              });
                            }}
                          >
                            <span>delete</span>
                            <TrashIcon />
                          </Button>
                        ),
                      },
                    ].map((cell, i) => (
                      <TableCell
                        key={i}
                        className={`px-2 py-1 whitespace-nowrap text-sm text-slate-950 text-center border border-gray-200 ${
                          i === 8 ? '' : 'text-center'
                        }`}
                      >
                        {cell.content}
                      </TableCell>
                    ))}
                  </TableRow>
                ))}
                <TableRow>
                  <FormTableCell>
                    <FormField
                      control={inputForm.control}
                      name="tranDate"
                      render={({ field }) => (
                        <FormItem className="flex flex-col gap-2 justify-end">
                          <Popover>
                            <PopoverTrigger asChild>
                              <FormControl>
                                <Button
                                  variant={'outline'}
                                  className={cn(
                                    'w-full pl-3 text-left font-normal',
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
                  </FormTableCell>
                  <FormTableCell>
                    <FormField
                      control={inputForm.control}
                      name="supplierId"
                      render={({ field }) => (
                        <FormItem>
                          <Select onValueChange={field.onChange} defaultValue={String(field.value)}>
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue>
                                  {[
                                    { id: 'id-1', name: 'Name 1' },
                                    { id: 'id-2', name: 'Name 2' },
                                    { id: 'id-3', name: 'Name 3' },
                                    { id: 'id-4', name: 'Name 4' },
                                    { id: 'id-5', name: 'Name 5' },
                                  ].find((supplier) => supplier.id === field.value)?.name || 'select supplier'}
                                </SelectValue>
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              {[
                                { id: 'id-1', name: 'Name 1' },
                                { id: 'id-2', name: 'Name 2' },
                                { id: 'id-3', name: 'Name 3' },
                                { id: 'id-4', name: 'Name 4' },
                                { id: 'id-5', name: 'Name 5' },
                              ].map((supplier, index) => (
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
                  </FormTableCell>
                  <FormTableCell>
                    <FormField
                      control={inputForm.control}
                      name="itemId"
                      render={({ field }) => (
                        <FormItem>
                          <Select onValueChange={field.onChange} defaultValue={String(field.value)}>
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue>
                                  {[
                                    { id: 'id-1', name: 'Name 1' },
                                    { id: 'id-2', name: 'Name 2' },
                                    { id: 'id-3', name: 'Name 3' },
                                    { id: 'id-4', name: 'Name 4' },
                                    { id: 'id-5', name: 'Name 5' },
                                  ].find((item) => item.id === field.value)?.name || 'select item'}
                                </SelectValue>
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              {[
                                { id: 'id-1', name: 'Name 1' },
                                { id: 'id-2', name: 'Name 2' },
                                { id: 'id-3', name: 'Name 3' },
                                { id: 'id-4', name: 'Name 4' },
                                { id: 'id-5', name: 'Name 5' },
                              ].map((item, index) => (
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
                  </FormTableCell>
                  <FormTableCell>
                    <FormField
                      control={inputForm.control}
                      name="quantity"
                      render={({ field }) => (
                        <FormItem>
                          <FormControl>
                            <Input
                              type="number"
                              placeholder="0"
                              {...field}
                              onChange={(event) => field.onChange(+event.target.value)}
                              min="1"
                              className="w-[100px]"
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </FormTableCell>
                  <FormTableCell>
                    <FormField
                      control={inputForm.control}
                      name="amount"
                      render={({ field }) => (
                        <FormItem>
                          <FormControl>
                            <Input
                              type="number"
                              placeholder="0"
                              {...field}
                              onChange={(event) => field.onChange(+event.target.value)}
                              min="1"
                              className="w-[100px]"
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </FormTableCell>
                  <FormTableCell>
                    <FormField
                      control={inputForm.control}
                      name="invoice"
                      render={({ field }) => (
                        <FormItem>
                          <FormControl>
                            <Input
                              type="number"
                              placeholder="0"
                              {...field}
                              onChange={(event) => field.onChange(+event.target.value)}
                              min="1"
                              className="w-[100px]"
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </FormTableCell>
                  <FormTableCell>
                    <FormField
                      control={inputForm.control}
                      name="paymentStatus"
                      render={({ field }) => (
                        <FormItem>
                          <Select onValueChange={field.onChange} defaultValue={String(field.value)}>
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue>{PaymentStatusEnum[field.value]}</SelectValue>
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              {Object.values(PaymentStatusEnum).map((paymentStatus, index) => (
                                <SelectItem key={index} value={String(paymentStatus)}>
                                  {paymentStatus}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </FormTableCell>
                  <FormTableCell>
                    <FormField
                      control={inputForm.control}
                      name="paymentType"
                      render={({ field }) => (
                        <FormItem>
                          <Select onValueChange={field.onChange} defaultValue={String(field.value)}>
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue>{PaymentTypeEnum[field.value]}</SelectValue>
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              {Object.values(PaymentTypeEnum).map((paymentType, index) => (
                                <SelectItem key={index} value={String(paymentType)}>
                                  {paymentType}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </FormTableCell>
                  <FormTableCell>
                    <Button
                      type="button"
                      variant={'outline'}
                      className="w-full bg-emerald-500 text-white"
                      onClick={() => {
                        append();
                      }}
                    >
                      Add
                    </Button>
                  </FormTableCell>
                </TableRow>
              </TableBody>
              <TableFooter></TableFooter>
            </Table>
            <div className="flex gap-6  justify-start w-full">
              <Button
                type="button"
                variant={'destructive'}
                disabled={form.watch('records').length === 0 || isPending}
                onClick={() => {
                  startTransition(() => {
                    formArray.remove();
                  });
                }}
              >
                Delete All
              </Button>
              <Button type="submit" variant={'default'} disabled={form.watch('records').length === 0 || isPending}>
                Save
              </Button>
            </div>
          </div>
        </form>
      </Form>
    );
  };

  const onSubmit: SubmitHandler<z.infer<typeof CreateExpensesSchema>> = (formData) => {
    startTransition(() => {
      expenseTrackingActions.CreateExpense(formData);
    });
  };

  return (
    <div className="space-y-6 p-6 bg-white rounded-lg shadow-md">
      <h1 className="text-2xl font-semibold text-center text-gray-800">Add Your Expenses</h1>
      <p className="text-gray-600 text-center">
        Click &quot;Add&quot; to include a new expense item. When you&apos;re finished, click &quot;Save&quot; to save
        all your expenses.
      </p>
      <div className="mt-4">
        <ExpenseLogForm />
      </div>
    </div>
  );
}
