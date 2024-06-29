'use client';

import { Button } from '@/components/ui/button';
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { BusinessExpenseItemSchema, CreateBusinessExpenseSchema } from '@/schemas/create-business-expense-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useFieldArray, useForm, useWatch } from 'react-hook-form';
import { z } from 'zod';

export function CreateBusinessExpenseForm() {
  const createBusinessExpenseForm = useForm<z.infer<typeof CreateBusinessExpenseSchema>>({
    resolver: zodResolver(CreateBusinessExpenseSchema),
    defaultValues: {
      supplierId: '',
      expenseType: 'BUSINESS',
      paymentStatus: 'FULL',
      totalAmount: 1,
      totalPaid: 1,
      comments: '',
    },
  });

  const createBusinessExpenseItemForm = useForm<z.infer<typeof BusinessExpenseItemSchema>>({
    resolver: zodResolver(BusinessExpenseItemSchema),
    defaultValues: {
      itemId: '',
      quantityReceived: 1,
      amountPaid: 1,
    },
  });

  const CreateBusinessExpenseItemForm = () => {
    return (
      <Form {...createBusinessExpenseItemForm}>
        <form>
          <FormField
            control={createBusinessExpenseItemForm.control}
            name="itemId"
            render={({ field }) => (
              <FormItem className="flex-1">
                <FormLabel>Select Item</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={String(field.value)}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Item" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {['1', '2', '3'].map((menuItem, index) => (
                      <SelectItem key={index} value={String(index)}>
                        {menuItem}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
        </form>
      </Form>
    );
  };

  return (
    <div>
      <CreateBusinessExpenseItemForm />
    </div>
  );
}
