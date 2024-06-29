'use client';

import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { cn } from '@/lib/utils';
import { SupplierExpenseDetailSchema, SupplierExpenseSchema } from '@/services/schemas';
import { zodResolver } from '@hookform/resolvers/zod';
import { PaymentStatus as PaymentStatusEnum, PaymentType as PaymentTypeEnum } from '@prisma/client';
import { CalendarIcon, PlusCircledIcon } from '@radix-ui/react-icons';
import { format } from 'date-fns';
import { useState } from 'react';
import { SubmitHandler, useFieldArray, useForm } from 'react-hook-form';
import { z } from 'zod';

export function CreateSupplierExpenseForm() {
  const [showSupplierDetailForm, setShowSupplierDetailForm] = useState<boolean>(false);

  const form = useForm<z.infer<typeof SupplierExpenseSchema>>({
    resolver: zodResolver(SupplierExpenseSchema),
    defaultValues: {
      tranDate: new Date(), // Set current date as default in YYYY-MM-DD format
      paymentType: PaymentTypeEnum.CASH,
      paymentStatus: PaymentStatusEnum.PAID,
      supplierId: '',
      paidAmount: 1,
      invoiceAmount: 0,
      comment: '',
      supplierExpenses: [],
    },
  });

  const formDetailArray = useFieldArray({ control: form.control, name: 'supplierExpenses' });

  const detailForm = useForm<z.infer<typeof SupplierExpenseDetailSchema>>({
    resolver: zodResolver(SupplierExpenseDetailSchema),
    defaultValues: {
      itemId: '',
      quantityReceived: 1,
      quantityDamaged: 0,
      amountPaid: 0,
      amountPending: 0,
      comment: '',
    },
  });

  const onSubmit: SubmitHandler<z.infer<typeof SupplierExpenseSchema>> = (formData) => {
    console.log(formData);
  };

  const onDetailSubmit: SubmitHandler<z.infer<typeof SupplierExpenseDetailSchema>> = (detailData) => {
    // Handle detail form submission logic here
    console.log(detailData);
  };

  const SupplierExpenseDetailForm = () => {
    return (
      <Form {...detailForm}>
        <form onSubmit={detailForm.handleSubmit(onDetailSubmit)} className="space-y-6">
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
            <FormField
              control={detailForm.control}
              name="itemId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Item</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={String(field.value)}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue>Select Item</SelectValue>
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
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={detailForm.control}
              name="quantityReceived"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Quantity Received</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      placeholder="Quantity received from supplier."
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
            <FormField
              control={detailForm.control}
              name="quantityDamaged"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Quantity Damaged</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      placeholder="Quantity damaged from supplier."
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
            <FormField
              control={detailForm.control}
              name="amountPaid"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Amount Paid</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      placeholder="Amount paid to supplier."
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
            <FormField
              control={detailForm.control}
              name="amountPending"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Amount Pending</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      placeholder="Amount pending to supplier."
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
          </div>
          <FormField
            control={detailForm.control}
            name="comment"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Comment</FormLabel>
                <FormControl>
                  <Textarea placeholder="Make remarks for this expense" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button type="submit" variant={'default'} className="w-[170px] flex justify-center items-center gap-5">
            Add
            <PlusCircledIcon />
          </Button>
        </form>
      </Form>
    );
  };

  const SupplierExpenseForm = () => {
    return (
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
            <FormField
              control={form.control}
              name="paymentType"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Payment Type</FormLabel>
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
            <FormField
              control={form.control}
              name="paymentStatus"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Payment Status</FormLabel>
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
            <FormField
              control={form.control}
              name="supplierId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Select Supplier</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={String(field.value)}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue>Select supplier</SelectValue>
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
            <FormField
              control={form.control}
              name="tranDate"
              render={({ field }) => (
                <FormItem className="flex flex-col gap-2 justify-end">
                  <Label>Transaction Date</Label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <FormControl>
                        <Button
                          variant={'outline'}
                          className={cn('w-full pl-3 text-left font-normal', !field.value && 'text-muted-foreground')}
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
            <FormField
              control={form.control}
              name="invoiceAmount"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Invoice Amount</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      placeholder="Invoice amount"
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
            <FormField
              control={form.control}
              name="paidAmount"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Paid Amount</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      placeholder="Paid amount"
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
          </div>
          <FormField
            control={form.control}
            name="comment"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Comment</FormLabel>
                <FormControl>
                  <Textarea placeholder="Make remarks for this expense" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          {showSupplierDetailForm && (
            <div className="border-t-4 pt-4 flex flex-col gap-4">
              <h1 className="text-left text-2xl">Add Supplied Item Details</h1>
              <div className="border p-6 rounded-md border-slate-400 shadow-md">
                <SupplierExpenseDetailForm />
              </div>
            </div>
          )}
          <div className="flex justify-start items-center mt-4 gap-4">
            {!showSupplierDetailForm ? (
              <Button
                type="button"
                variant={'outline'}
                className="flex justify-center items-center gap-4 border w-[180px]"
                onClick={() => {
                  setShowSupplierDetailForm(true);
                }}
              >
                Add more details
                <PlusCircledIcon />
              </Button>
            ) : (
              <Button
                type="button"
                variant={'outline'}
                className="flex justify-center items-center gap-4 border w-[180px]"
                onClick={() => {
                  setShowSupplierDetailForm(false);
                }}
              >
                Done
              </Button>
            )}
            {!showSupplierDetailForm && <Button type="submit">Submit</Button>}
          </div>
        </form>
      </Form>
    );
  };

  return (
    <>
      <SupplierExpenseForm />
    </>
  );
}
