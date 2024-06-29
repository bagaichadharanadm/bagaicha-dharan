'use client';

import { ExpenseTable } from '@/components/dashboard/expense-tracking/expense-table';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { Form, FormControl, FormDescription, FormField, FormItem, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableFooter, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { cn } from '@/lib/utils';
import { ExpenseLogSchema, ExpenseLogsSchema } from '@/services/schemas';
import { zodResolver } from '@hookform/resolvers/zod';
import { PaymentStatus as PaymentStatusEnum, PaymentType as PaymentTypeEnum } from '@prisma/client';
import { CalendarIcon } from '@radix-ui/react-icons';
import { format } from 'date-fns';
import { useTransition } from 'react';
import { SubmitHandler, useFieldArray, useForm } from 'react-hook-form';
import { z } from 'zod';

type ExpenseLogFormProps = {
  data: {
    id: string;
    tranDate: Date;
    supplierId: string;
    supplierName: string; // Assuming you have supplierName in your data
    employeeId: string;
    employeeName: string;
    itemId: string;
    itemName: string; // Assuming you have itemName in your data
    quantity: number;
    amount: number;
    invoice: number;
    paymentType: string;
    paymentStatus: string;
    comment: string;
  }[];
};
export function ExpenseLogForm({ data }: ExpenseLogFormProps) {
  const [isPending, startTransition] = useTransition();

  const inputForm = useForm<z.infer<typeof ExpenseLogSchema>>({
    resolver: zodResolver(ExpenseLogSchema),
    defaultValues: {
      tranDate: new Date(),
      itemId: '',
      supplierId: '',
      employeeId: '',
      quantity: 0,
      amount: 0,
      invoice: 0,
      paymentType: 'CASH',
      paymentStatus: 'PAID',
      invoiceAmount: 0,
      comment: '',
    },
  });

  const formatDate = (date: Date): string => {
    const options: Intl.DateTimeFormatOptions = {
      day: '2-digit',
      month: 'short',
      year: '2-digit',
    };
    return date.toLocaleDateString('en-US', options).toUpperCase();
  };

  const form = useForm<z.infer<typeof ExpenseLogsSchema>>({
    resolver: zodResolver(ExpenseLogsSchema),
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

  const ExpenseLogForm = () => {
    return (
      <Form {...inputForm}>
        <form>
          <div className="flex flex-col gap-4 items-end">
            <Table className="min-w-full bg-white border border-gray-300">
              <TableHeader>
                <TableRow className="bg-gray-200">
                  <TableHead className="px-6 py-3 text-left text-xs font-medium text-gray-800 uppercase tracking-wider border border-gray-300">
                    Date
                  </TableHead>
                  <TableHead className="px-6 py-3 text-left text-xs font-medium text-gray-800 uppercase tracking-wider border border-gray-300">
                    Supplier
                  </TableHead>
                  <TableHead className="px-6 py-3 text-left text-xs font-medium text-gray-800 uppercase tracking-wider border border-gray-300">
                    Item
                  </TableHead>
                  <TableHead className="px-6 py-3 text-left text-xs font-medium text-gray-800 uppercase tracking-wider border border-gray-300">
                    Quantity
                  </TableHead>
                  <TableHead className="px-6 py-3 text-right text-xs font-medium text-gray-800 uppercase tracking-wider border border-gray-300">
                    Amount
                  </TableHead>
                  <TableHead className="px-6 py-3 text-left text-xs font-medium text-gray-800 uppercase tracking-wider border border-gray-300">
                    Invoice
                  </TableHead>
                  <TableHead className="px-6 py-3 text-left text-xs font-medium text-gray-800 uppercase tracking-wider border border-gray-300">
                    Method
                  </TableHead>
                  <TableHead className="px-6 py-3 text-left text-xs font-medium text-gray-800 uppercase tracking-wider border border-gray-300">
                    Status
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                <TableRow>
                  <TableCell className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 border border-gray-300">
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
                  </TableCell>
                  <TableCell className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 border border-gray-300">
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
                  </TableCell>
                  <TableCell className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 border border-gray-300">
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
                  </TableCell>
                  <TableCell className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 text-right border border-gray-300">
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
                              className="w-full"
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </TableCell>
                  <TableCell className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 text-right border border-gray-300">
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
                              className="w-full"
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </TableCell>
                  <TableCell className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 text-right border border-gray-300">
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
                              className="w-full"
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </TableCell>
                  <TableCell className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 border border-gray-300">
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
                  </TableCell>
                  <TableCell className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 border border-gray-300">
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
                  </TableCell>
                </TableRow>
              </TableBody>
              <TableFooter></TableFooter>
            </Table>
            <div className="flex gap-4">
              <Button
                type="button"
                variant={'outline'}
                onClick={() => {
                  append();
                }}
              >
                Add
              </Button>
              <Button type="submit" disabled={form.watch('records').length === 0}>
                Done
              </Button>
            </div>
          </div>
        </form>
      </Form>
    );
  };

  return (
    <div className="space-y-8">
      <ExpenseLogForm />
      <h1 className="text-2xl">Today&apos;s expenses</h1>
      <ExpenseTable
        data={[
          ...data,
          ...formArray.fields.map((field) => ({
            id: '',
            tranDate: field.tranDate,
            supplierId: field.supplierId,
            supplierName: field.supplierId, // Assuming supplierName can be empty
            employeeId: field.employeeId,
            employeeName: field.employeeId, // Assuming employeeName can be empty
            itemId: field.itemId,
            itemName: field.itemId, // Assuming itemName can be empty
            quantity: field.quantity,
            amount: field.amount,
            invoice: field.invoice,
            paymentType: field.paymentType,
            paymentStatus: field.paymentStatus,
            comment: field.comment ?? '', // Ensure comment is a string
          })),
        ]}
        showHeader={true}
      />
    </div>
  );
}
