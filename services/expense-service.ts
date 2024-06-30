import prisma from '@/db';
import { CreateEmployeeExpensesSchema } from '@/schemas';
import { z } from 'zod';

/**
 * Creates multiple expense records in the database.
 *
 * @param {z.infer<typeof CreateEmployeeExpensesSchema>} data - The data for creating expenses.
 * @returns {Promise<void>} - A promise that resolves when the expenses are created.
 *
 * @example
 * const data = {
 *   employeeId: '123',
 *   records: [
 *     {
 *       tranDate: new Date(),
 *       itemId: 'item1',
 *       supplierId: 'supplier1',
 *       employeeId: 'employee1',
 *       quantity: 10,
 *       amount: 100,
 *       invoice: 12345,
 *       paymentType: 'CASH',
 *       paymentStatus: 'PAID',
 *       comment: 'Test comment',
 *     },
 *     // additional records
 *   ],
 * };
 * await createExpenses(data);
 */
export async function createExpenses(data: z.infer<typeof CreateEmployeeExpensesSchema>): Promise<void> {
  await prisma.expense.createMany({
    data: data.records.map((record) => ({
      transactionDate: record.tranDate,
      itemId: record.itemId,
      supplierId: record.supplierId,
      employeeId: record.employeeId,
      quantity: record.quantity,
      amount: record.amount,
      invoice: record.invoice,
      paymentType: record.paymentType,
      paymentStatus: record.paymentStatus,
      comments: record.comment,
    })),
  });
}
