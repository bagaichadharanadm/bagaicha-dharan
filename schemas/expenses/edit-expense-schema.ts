import { PaymentStatus as PaymentStatusEnum, PaymentType as paymentTypeEnum } from '@prisma/client';
import { z } from 'zod';

export const EditEmployeeExpenseSchema = z.object({
  id: z.string(),
  tranDate: z.date(),
  itemId: z.string().min(1, { message: 'item is required.' }),
  supplierId: z.string().min(1, { message: 'supplier is required.' }),
  employeeId: z.string().min(1, { message: 'employee is required.' }),
  quantity: z.number().gt(0, { message: 'quantity cannot be less than 1' }),
  amount: z.number().gt(0, { message: 'amount cannot be less than 1' }),
  invoice: z.number().gt(0, { message: 'amount cannot be less than 1' }),
  paymentType: z.nativeEnum(paymentTypeEnum),
  paymentStatus: z.nativeEnum(PaymentStatusEnum),
  comment: z.string(),
  reviewed: z.boolean().nullable(),
  accepted: z.boolean().nullable(),
  createdAt: z.date(),
  updatedAt: z.date(),
});

export const EditEmployeeExpensesSchema = z.object({
  records: z.array(EditEmployeeExpenseSchema),
});
