'use server';

import { ExpenseLogsSchema } from '@/schemas';
import { z } from 'zod';

export async function CreateExpense(formData: z.infer<typeof ExpenseLogsSchema>) {
  console.log(formData);
}
