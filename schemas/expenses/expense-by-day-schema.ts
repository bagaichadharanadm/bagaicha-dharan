import { z } from 'zod';

export const ExpenseByDaySchema = z.object({
  tranDate: z
    .string()
    .min(8, { message: 'Invalid date provided' })
    .max(8, { message: 'Invalid date provided' })
    .regex(/^\d{8}$/, { message: 'Invalid date format. Must be YYYYMMDD.' }),
});
