'use server';

import { auth } from '@/auth';
import prisma from '@/db';
import { CreateEmployeeExpensesSchema } from '@/schemas';
import { expenseServices } from '@/services';
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
    return { error: { message: 'User session expired. Please log in again.' } };
  }

  // Attempt to create expenses
  try {
    await expenseServices.createExpenses(validatedFields.data);
    return { success: { message: 'Expenses added successfully.' } };
  } catch (error) {
    console.error('Error creating expenses:', error);
    return { error: { message: 'Failed to add expenses. Please try again later.' } };
  }
}
