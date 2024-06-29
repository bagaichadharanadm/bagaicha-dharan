import { PaymentStatus as PaymentStatusEnum, PaymentType as paymentTypeEnum } from '@prisma/client';
import { z } from 'zod';

export const SupplierExpenseDetailSchema = z.object({
  itemId: z.string(),
  quantityReceived: z.number(),
  quantityDamaged: z.number(),
  amountPaid: z.number(),
  amountPending: z.number(),
  comment: z.string().optional(),
});

export const SupplierExpenseSchema = z.object({
  tranDate: z.date(),
  paymentType: z.nativeEnum(paymentTypeEnum),
  paymentStatus: z.nativeEnum(PaymentStatusEnum),
  supplierId: z.string(),
  paidAmount: z.number(),
  invoiceAmount: z.number(),
  comment: z.string().optional(),
  supplierExpenses: z.array(SupplierExpenseDetailSchema),
});
