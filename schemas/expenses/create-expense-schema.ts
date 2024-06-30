import { PaymentStatus as PaymentStatusEnum, PaymentType as paymentTypeEnum } from '@prisma/client';
import { z } from 'zod';

export const CreateExpenseSchema = z.object({
  tranDate: z.date(),
  itemId: z.string(),
  supplierId: z.string(),
  employeeId: z.string(),
  quantity: z.number(),
  amount: z.number(),
  invoice: z.number(),
  paymentType: z.nativeEnum(paymentTypeEnum),
  paymentStatus: z.nativeEnum(PaymentStatusEnum),
  invoiceAmount: z.number(),
  comment: z.string().optional(),
});

export const CreateExpensesSchema = z.object({ records: z.array(CreateExpenseSchema) });
