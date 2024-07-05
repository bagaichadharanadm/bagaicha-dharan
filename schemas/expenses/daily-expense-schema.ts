import { z } from 'zod';

export const DailyExpenseSchema = z.object({
  tranDate: z.date(),
});
