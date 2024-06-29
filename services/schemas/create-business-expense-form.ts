import { z } from 'zod';

// Define the schema for individual items
export const BusinessExpenseItemSchema = z.object({
  itemId: z.string().min(1, 'Item ID is required'),
  quantityReceived: z.number().min(1, 'Quantity must be at least 1').max(10000, 'Quantity cannot exceed 10000'),
  amountPaid: z.number().min(0, 'Amount paid cannot be negative').max(1000000, 'Amount paid cannot exceed 1,000,000'),
});

// Define the schema for creating a business expense
export const CreateBusinessExpenseSchema = z.object({
  supplierId: z.string().min(1, 'Supplier ID is required'),
  expenseType: z.string().min(1, 'Expense type is required'),
  paymentStatus: z.string().min(1, 'Payment status is required'),
  items: z.array(BusinessExpenseItemSchema).min(1, 'At least one item is required'),
  totalPaid: z.number().min(0, 'Total paid cannot be negative'),
  totalAmount: z.number().min(1, 'Total amount must be at least 1'),
  comments: z.string().optional(),
});
