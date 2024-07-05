'use server';

import { auth } from '@/auth';
import getUserSessionAndRole from '@/lib/get-user-session-and-role';
import {
  CreateEmployeeExpensesSchema,
  EditEmployeeExpenseSchema,
  EditEmployeeExpensesSchema,
  ExpenseByDaySchema,
} from '@/schemas';
import { expenseServices } from '@/services';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { z } from 'zod';

export async function CreateExpense(
  formData: z.infer<typeof CreateEmployeeExpensesSchema>,
): Promise<{ success?: { message: string } } | { error?: { message: string } }> {
  // Validate input fields using the schema
  const validatedFields = CreateEmployeeExpensesSchema.safeParse(formData);
  console.log(formData);
  // Check if validation succeeded
  if (!validatedFields.success) {
    return { error: { message: 'Validation failed. Please check your input.' } };
  }

  for (const record of validatedFields.data.records) {
    switch (true) {
      case record.amount < record.invoice:
        record.paymentStatus = 'PARTIAL';
        break;
      case record.amount > record.invoice:
        record.paymentStatus = 'CREDIT';
        break;
      case record.amount === record.invoice:
        record.paymentStatus = 'PAID';
        break;
      default:
        break;
    }
  }

  console.log(validatedFields.data.records);

  // Check if user is authenticated
  const user = await getUserSessionAndRole();
  if (!user.isSignedIn) {
    redirect('/auth/login');
  }

  // Attempt to create expenses

  await expenseServices.createExpenses(validatedFields.data);
  revalidatePath('/dashboard/expense-tracking/view');
  revalidatePath('/dashboard/expense-tracking/edit');
  return { success: { message: 'Expenses added successfully.' } };
}

export async function EditExpense(
  formData: z.infer<typeof EditEmployeeExpensesSchema>,
): Promise<{ error?: { message: string } }> {
  // Validate input fields using the schema
  const validatedFields = EditEmployeeExpensesSchema.safeParse(formData);

  // Check if validation succeeded
  if (!validatedFields.success) {
    return { error: { message: 'Invalid fields provided' } };
  }

  // Attempt to update expenses
  const updatedExpenses = await expenseServices.updateExpenses(validatedFields.data);
  console.log(updatedExpenses);
  // Revalidate paths to ensure updated data is displayed
  revalidatePath('/dashboard/expense-tracking/edit');
  revalidatePath('/dashboard/expense-tracking/view');
  redirect('/dashboard/expense-tracking/edit');
}

export async function getExpensesByDay(tranDate: z.infer<typeof ExpenseByDaySchema>) {
  // const validatedFields = ExpenseByDaySchema.safeParse(tranDate);
  // if (!validatedFields.success) {
  //   return { error: { message: validatedFields.error.message } };
  // }
  // const dailyExpenses = await expenseServices.getDailyExpenses(validatedFields.data.tranDate);
  // return { success: { message: 'fetch successful' }, data: dailyExpenses };
}

export async function redirectBetweenExpensePages(redirectUrl: string) {
  redirect(redirectUrl);
}
