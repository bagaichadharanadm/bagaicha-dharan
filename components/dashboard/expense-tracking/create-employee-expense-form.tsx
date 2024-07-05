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
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableFooter, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { formatDate } from '@/lib/format-date';
import { cn } from '@/lib/utils';
import { CreateEmployeeExpenseSchema, CreateEmployeeExpensesSchema } from '@/schemas';
import { CreateEmployeeExpenseFormProps } from '@/types/props';
import { zodResolver } from '@hookform/resolvers/zod';
import { PaymentStatus as PaymentStatusEnum, PaymentType as PaymentTypeEnum } from '@prisma/client';
import { CalendarIcon, CheckCircledIcon, ExclamationTriangleIcon, TrashIcon } from '@radix-ui/react-icons';
import { format } from 'date-fns';
import { useState, useTransition } from 'react';
import { SubmitHandler, useFieldArray, useForm } from 'react-hook-form';
import { z } from 'zod';

export function CreateEmployeeExpenseForm({ items, suppliers, employees }: CreateEmployeeExpenseFormProps) {
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

  const inputForm = useForm<z.infer<typeof CreateEmployeeExpenseSchema>>({
    resolver: zodResolver(CreateEmployeeExpenseSchema),
    defaultValues: {
      tranDate: new Date(),
      itemId: items[0].id,
      supplierId: suppliers[0].id,
      employeeId: employees[0].id,
      quantity: 1,
      amount: 1,
      invoice: 1,
      paymentType: 'CASH',
      paymentStatus: 'PAID',
      comment: '',
    },
  });

  const form = useForm<z.infer<typeof CreateEmployeeExpensesSchema>>({
    resolver: zodResolver(CreateEmployeeExpensesSchema),
    defaultValues: { employeeId: employees[0].id, records: [] },
  });

  const formArray = useFieldArray({ name: 'records', control: form.control });

  const append = () => {
    startTransition(() => {
      formArray.append({
        tranDate: inputForm.watch('tranDate') === undefined ? new Date() : inputForm.watch('tranDate'),
        itemId: inputForm.watch('itemId'),
        supplierId: inputForm.watch('supplierId'),
        employeeId: form.watch('employeeId'),
        quantity: inputForm.watch('quantity'),
        amount: inputForm.watch('amount'),
        invoice: inputForm.watch('invoice'),
        paymentType: inputForm.watch('paymentType'),
        paymentStatus: inputForm.watch('paymentStatus'),
        comment: inputForm.watch('comment'),
      });
    });
    inputForm.reset();
  };

  const FormTableCell = ({ children }: { children: React.ReactNode }) => {
    console.log(formArray.fields);
    return (
      <TableCell className="px-2 py-1 whitespace-nowrap text-sm text-gray-500 border border-gray-300">
        {children}
      </TableCell>
    );
  };

  const ExpenseLogForm = () => {
    return (
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <div className="flex flex-col gap-4 items-end">
            <FormField
              control={form.control}
              name="employeeId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Select Employee</FormLabel>

                  <Select onValueChange={field.onChange} defaultValue={String(field.value)}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue>
                          {employees.find((employee) => employee.id === field.value)?.name || 'select employee'}
                        </SelectValue>
                      </SelectTrigger>
                    </FormControl>
                    <FormDescription>
                      Expense will be recorded <br /> under selected employee.
                    </FormDescription>

                    <SelectContent>
                      {employees.map((employee, index) => (
                        <SelectItem key={index} value={employee.id}>
                          {employee.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormDescription />
                  <FormMessage />
                </FormItem>
              )}
            />
            <Table className="min-w-full bg-white border border-gray-300">
              <TableHeader>
                <TableRow className="bg-gray-200">
                  {['Date', 'Supplier', 'Item', 'Quantity', 'Amount', 'Invoice', 'Method', 'Comments', 'Actions'].map(
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
                      { content: row.tranDate ? formatDate(row.tranDate) : formatDate(new Date()) },
                      { content: suppliers.find((supplier) => supplier.id === row.supplierId)?.name || '' },
                      { content: items.find((item) => item.id === row.itemId)?.name || '' },
                      { content: row.quantity },
                      { content: row.amount },
                      { content: row.invoice },
                      { content: row.paymentType },
                      // { content: row.paymentStatus },
                      { content: row.comment },
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
                {/* Input form */}
                <TableRow>
                  {/* Tran date input */}
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
                  {/* Supplier dropdown */}
                  <FormTableCell>
                    <div className="pt-2">
                      <FormField
                        control={inputForm.control}
                        name="supplierId"
                        render={({ field }) => (
                          <FormItem>
                            <Select onValueChange={field.onChange} defaultValue={String(field.value)}>
                              <FormControl>
                                <SelectTrigger>
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
                  </FormTableCell>
                  {/* Item dropdown */}
                  <FormTableCell>
                    <div className="pt-2">
                      <FormField
                        control={inputForm.control}
                        name="itemId"
                        render={({ field }) => (
                          <FormItem>
                            <Select onValueChange={field.onChange} defaultValue={String(field.value)}>
                              <FormControl>
                                <SelectTrigger>
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
                  </FormTableCell>
                  {/* Quantity Input */}
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
                  {/* Amount Input */}
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
                  {/* Invoice Input */}
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
                              autoComplete="off"
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </FormTableCell>
                  {/*  */}
                  {/* <FormTableCell>
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
                  </FormTableCell> */}
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
                    <FormField
                      control={inputForm.control}
                      name="comment"
                      render={({ field }) => (
                        <FormItem>
                          <FormControl>
                            <Input placeholder="optional" {...field} autoComplete="off" />
                          </FormControl>

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

              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button variant="outline" disabled={form.watch('records').length === 0 || isPending}>
                    Save
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                    <AlertDialogDescription>
                      This action cannot be undone. This will permanently delete your account and remove your data from
                      our servers.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction onClick={form.handleSubmit(onSubmit)}>Yes</AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            </div>
          </div>
        </form>
      </Form>
    );
  };

  const onSubmit: SubmitHandler<z.infer<typeof CreateEmployeeExpensesSchema>> = (formData) => {
    startTransition(() => {
      expenseTrackingActions
        .CreateExpense(formData)
        .then((data) => {
          setFormResponse(data);
        })
        .then(() => {
          inputForm.reset();
          form.reset();
        })
        .then(() => {
          setTimeout(() => {
            setFormResponse(undefined); // Clearing formResponse after 3 seconds
          }, 2000); // Timeout set to 3 seconds (3000 milliseconds)
        });
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
