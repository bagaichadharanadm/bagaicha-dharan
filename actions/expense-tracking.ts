'use server';

import getUserSessionAndRole from '@/lib/get-user-session-and-role';
import { CreateEmployeeExpensesSchema, DailyExpenseSchema, EditEmployeeExpensesSchema } from '@/schemas';
import { expenseServices } from '@/services';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { z } from 'zod';

export async function CreateExpense(
  formData: z.infer<typeof CreateEmployeeExpensesSchema>,
): Promise<{ success?: { message: string } } | { error?: { message: string } }> {
  // Validate input fields using the schema
  const validatedFields = CreateEmployeeExpensesSchema.safeParse(formData);

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

  // Check if user is authenticated
  const user = await getUserSessionAndRole();
  if (!user.isSignedIn) {
    redirect('/auth/login');
  }

  if (user.role !== 'ADMIN') {
    return { error: { message: 'Only admins are allowed to edit expenses.' } };
  }

  // Attempt to update expenses
  const updatedExpenses = await expenseServices.updateExpenses(validatedFields.data);

  // Revalidate paths to ensure updated data is displayed
  revalidatePath('/dashboard/expense-tracking/edit');
  revalidatePath('/dashboard/expense-tracking/view');
  redirect('/dashboard/expense-tracking');
}

export async function getDailyExpenses(formData: z.infer<typeof DailyExpenseSchema>) {
  const validatedFields = DailyExpenseSchema.safeParse(formData);
  if (!validatedFields.success) {
    return { error: { message: 'Invalid field provided' } };
  }
  const tranDate: string = formData.tranDate.toISOString().slice(0, 10).replace(/-/g, '');
  redirect(`/dashboard/expense-tracking/view/${tranDate}`);
}
