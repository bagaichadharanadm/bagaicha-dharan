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
import { CalendarIcon } from '@radix-ui/react-icons';
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
      <TableCell className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 border border-gray-300">
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
                  {['Date', 'Supplier', 'Item', 'Quantity', 'Amount', 'Invoice', 'Method', 'Status'].map(
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
                {form.watch('records').map((row, index) => {
                  return (
                    <TableRow key={index}>
                      <FormTableCell>{formatDate(row.tranDate)}</FormTableCell>
                      <FormTableCell>{row.supplierId}</FormTableCell>
                      <FormTableCell>{row.itemId}</FormTableCell>
                      <FormTableCell>{row.quantity}</FormTableCell>
                      <FormTableCell>{row.amount}</FormTableCell>
                      <FormTableCell>{row.invoice}</FormTableCell>
                      <FormTableCell>{row.paymentType}</FormTableCell>
                      <FormTableCell>{row.paymentStatus}</FormTableCell>
                    </TableRow>
                  );
                })}
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
                                <SelectValue className="w-full">
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
                </TableRow>
              </TableBody>
              <TableFooter></TableFooter>
            </Table>
            <div className="flex gap-6  justify-end w-full">
              <Button
                type="button"
                variant={'outline'}
                onClick={() => {
                  append();
                }}
              >
                Add
              </Button>
              <Button type="submit" disabled={form.watch('records').length === 0 || isPending}>
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
    <div className="space-y-8">
      <ExpenseLogForm />
    </div>
  );
}
