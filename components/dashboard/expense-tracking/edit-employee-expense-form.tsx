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
import { EditEmployeeExpensesSchema } from '@/schemas';
import { EditEmployeeExpenseFormProps } from '@/types/props';
import { zodResolver } from '@hookform/resolvers/zod';
import { PaymentStatus as PaymentStatusEnum, PaymentType as PaymentTypeEnum } from '@prisma/client';
import { CalendarIcon, CheckCircledIcon, Cross1Icon } from '@radix-ui/react-icons';
import { format } from 'date-fns';
import { useTransition } from 'react';
import { SubmitHandler, useFieldArray, useForm } from 'react-hook-form';
import { z } from 'zod';

export function EditEmployeeExpenseForm({ expenses, items, suppliers, employees }: EditEmployeeExpenseFormProps) {
  const [isePending, startTransition] = useTransition();

  const form = useForm<z.infer<typeof EditEmployeeExpensesSchema>>({
    resolver: zodResolver(EditEmployeeExpensesSchema),
    defaultValues: {
      // Map over expenses to create initial form values
      records: expenses.map((expense) => ({
        id: expense.id,
        tranDate: expense.transactionDate, // Assuming tranDate is a Date object
        itemId: expense.itemId,
        supplierId: expense.supplierId,
        employeeId: expense.employeeId,
        quantity: expense.quantity,
        amount: expense.amount,
        invoice: expense.invoice,
        paymentType: expense.paymentType,
        paymentStatus: expense.paymentStatus,
        comment: expense.comments || '',
        reviewed: expense.reviewed || false, // Defaulting to false if not set
        accepted: expense.accepted || false, // Defaulting to false if not set
        createdAt: expense.createdAt,
        updatedAt: expense.updatedAt,
      })),
    },
  });

  const formArray = useFieldArray({ control: form.control, name: 'records' });

  const onSubmit: SubmitHandler<z.infer<typeof EditEmployeeExpensesSchema>> = (formData) => {
    expenseTrackingActions.EditExpense(formData);
  };

  function rejectAll() {
    startTransition(() => {
      for (let index = 0; index < formArray.fields.length; index++) {
        const expense = formArray.fields[index];
        form.setValue(`records.${index}.reviewed`, true);
        form.setValue(`records.${index}.accepted`, false);
      }
    });
  }

  function acceptAll() {
    startTransition(() => {
      for (let index = 0; index < formArray.fields.length; index++) {
        const expense = formArray.fields[index];
        form.setValue(`records.${index}.reviewed`, true);
        form.setValue(`records.${index}.accepted`, true);
      }
    });
  }

  const EditExpenseForm = () => {
    return (
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
                    'Actions',
                  ].map((header, index) => {
                    return (
                      <TableHead
                        key={index}
                        className="px-6 py-3 text-left text-xs font-medium text-gray-800 uppercase tracking-wider border border-gray-300"
                      >
                        {header}
                      </TableHead>
                    );
                  })}
                </TableRow>
              </TableHeader>
              <TableBody>
                {formArray.fields.map((row, index) => (
                  <TableRow>
                    {[
                      {
                        content: (
                          // Tran Date
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
                                          variant={'outline'}
                                          className={cn(
                                            'w-full pl-3 text-left font-normal bg-gray-100',
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
                        ),
                      },
                      {
                        content: (
                          // Supplier
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
                        ),
                      },
                      {
                        content: (
                          // Item
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
                        ),
                      },
                      {
                        content: (
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
                        ),
                      },
                      {
                        content: (
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
                        ),
                      },
                      {
                        content: (
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
                        ),
                      },
                      {
                        content: (
                          <FormField
                            control={form.control}
                            name={`records.${index}.paymentType`}
                            render={({ field }) => (
                              <FormItem>
                                <Select onValueChange={field.onChange} defaultValue={String(field.value)}>
                                  <FormControl>
                                    <SelectTrigger className="w-[100px] bg-gray-100">
                                      <SelectValue>{PaymentTypeEnum[field.value]}</SelectValue>
                                    </SelectTrigger>
                                  </FormControl>
                                  <SelectContent>
                                    {Object.values(PaymentTypeEnum).map((paymentStatus, index) => (
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
                        ),
                      },
                      {
                        content: (
                          <FormField
                            control={form.control}
                            name={`records.${index}.paymentStatus`}
                            render={({ field }) => (
                              <FormItem>
                                <Select onValueChange={field.onChange} defaultValue={String(field.value)}>
                                  <FormControl>
                                    <SelectTrigger className="w-[100px] bg-gray-100">
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
                        ),
                      },
                      {
                        content: (
                          <TableCell>
                            <FormField
                              control={form.control}
                              name={`records.${index}.comment`}
                              render={({ field }) => (
                                <FormItem>
                                  <FormControl>
                                    <Input
                                      placeholder=""
                                      {...field}
                                      autoComplete="off"
                                      className="w-[100px] bg-gray-100"
                                    />
                                  </FormControl>

                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                          </TableCell>
                        ),
                      },
                      {
                        content: (
                          <div className="flex gap-4 justify-center items-center">
                            {/* Reject Button */}
                            <Button
                              variant="secondary"
                              className="flex items-center justify-center px-4 py-2 bg-red-100 text-red-600 rounded-md border border-red-200 hover:bg-red-200 focus:outline-none focus:ring-2 focus:ring-red-500"
                              onClick={() => {
                                startTransition(() => {
                                  formArray.remove(index);
                                });
                              }}
                            >
                              <span className="text-sm">Reject</span>
                              <Cross1Icon className="h-5 w-5 ml-2" />
                            </Button>

                            {/* Approve Button */}
                            <Button
                              variant="default"
                              className="flex items-center justify-center px-4 py-2 bg-green-100 text-green-600 rounded-md border border-green-200 hover:bg-green-200 focus:outline-none focus:ring-2 focus:ring-green-500"
                              onClick={() => {
                                startTransition(() => {
                                  formArray.remove(index);
                                });
                              }}
                            >
                              <span className="text-sm">Approve</span>
                              <CheckCircledIcon className="h-5 w-5 ml-2" />
                            </Button>
                          </div>
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
              </TableBody>
            </Table>
            <div className="flex gap-4 justify-start items-center">
              {/* Reject All Button */}
              <Button
                variant="secondary"
                className="flex items-center justify-center px-4 py-2 bg-red-100 text-red-600 rounded-md border border-red-200 hover:bg-red-200 focus:outline-none focus:ring-2 focus:ring-red-500"
                onClick={() => {
                  rejectAll();
                }}
              >
                <span className="text-sm">Reject All</span>
                <Cross1Icon className="h-5 w-5 ml-2" />
              </Button>

              {/* Accept All Button */}
              <Button
                variant="default"
                className="flex items-center justify-center px-4 py-2 bg-green-100 text-green-600 rounded-md border border-green-200 hover:bg-green-200 focus:outline-none focus:ring-2 focus:ring-green-500"
                onClick={() => {
                  acceptAll();
                }}
              >
                <span className="text-sm">Approve all</span>
                <CheckCircledIcon className="h-5 w-5 ml-2" />
              </Button>

              {/* Save Button */}
              <Button type="submit" variant="default">
                Save
              </Button>
            </div>
          </div>
        </form>
      </Form>
    );
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
        <EditExpenseForm />
      </div>
    </div>
  );
}
