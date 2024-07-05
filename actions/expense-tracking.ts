'use server';

import { auth } from '@/auth';
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

/**
 * Handles the creation of multiple expense records based on the provided form data.
 *
 * @param {z.infer<typeof CreateEmployeeExpensesSchema>} formData - The form data to create expense records.
 * @returns {Promise<{ success?: { message: string } } | { error?: { message: string } }>} - Success message or error message.
 */
export async function CreateExpense(
  formData: z.infer<typeof CreateEmployeeExpensesSchema>,
): Promise<{ success?: { message: string } } | { error?: { message: string } }> {
  // Validate input fields using the schema
  const validatedFields = CreateEmployeeExpensesSchema.safeParse(formData);

  // Check if validation succeeded
  if (!validatedFields.success) {
    return { error: { message: 'Validation failed. Please check your input.' } };
  }

  // Check if user is authenticated
  const session = await auth();
  if (!session) {
    redirect('/auth/login');
  }

  // Attempt to create expenses

  await expenseServices.createExpenses(validatedFields.data);
  revalidatePath('/dashboard/expense-tracking/view');
  revalidatePath('/dashboard/expense-tracking/edit');
  return { success: { message: 'Expenses added successfully.' } };
}

/**
 * Handles the update of multiple expense records based on the provided form data.
 *
 * @param {z.infer<typeof EditEmployeeExpensesSchema>} formData - The form data to update expense records.
 * @returns {Promise<{ success?: { message: string } } | { error?: { message: string } }>} - Success message or error message.
 */
export async function EditExpense(
  formData: z.infer<typeof EditEmployeeExpensesSchema>,
): Promise<{ success?: { message: string } } | { error?: { message: string } }> {
  console.log(formData);

  // Validate input fields using the schema
  const validatedFields = EditEmployeeExpensesSchema.safeParse(formData);

  // Check if validation succeeded
  if (!validatedFields.success) {
    return { error: { message: 'Invalid fields provided' } };
  }

  // Attempt to update expenses
  const updatedExpenses = await expenseServices.updateExpenses(validatedFields.data);

  // Revalidate paths to ensure updated data is displayed
  revalidatePath('/dashboard/expense-tracking/edit');
  revalidatePath('/dashboard/expense-tracking/view');
  return { success: { message: 'Records updated successfully.' } };
}

export async function getExpensesByDay(tranDate: z.infer<typeof ExpenseByDaySchema>) {
  const validatedFields = ExpenseByDaySchema.safeParse(tranDate);
  if (!validatedFields.success) {
    return { error: { message: validatedFields.error.message } };
  }
  const dailyExpenses = await expenseServices.getDailyExpenses(validatedFields.data.tranDate);
  return { success: { message: 'fetch successful' }, data: dailyExpenses };
}
