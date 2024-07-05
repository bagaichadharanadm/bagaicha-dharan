import { PaymentStatus as PaymentStatusEnum, PaymentType as PaymentTypeEnum } from '@prisma/client';
import { z } from 'zod';

// Define the schema for a single employee expense
export const CreateEmployeeExpenseSchema = z.object({
  tranDate: z.date(),
  itemId: z.string().min(1, { message: 'item is required.' }),
  supplierId: z.string().min(1, { message: 'supplier is required.' }),
  employeeId: z.string().min(1, { message: 'employee is required.' }),
  quantity: z.number().gt(0, { message: 'quantity cannot be less than 1' }),
  amount: z.number().gt(0, { message: 'amount cannot be less than 1' }),
  invoice: z.number().gt(0, { message: 'invoice cannot be less than 1' }),
  paymentType: z.nativeEnum(PaymentTypeEnum),
  paymentStatus: z.nativeEnum(PaymentStatusEnum),
  comment: z.string().optional(),
});

// Define the schema for multiple employee expenses
export const CreateEmployeeExpensesSchema = z.object({
  employeeId: z.string(),
  records: z.array(CreateEmployeeExpenseSchema),
});
