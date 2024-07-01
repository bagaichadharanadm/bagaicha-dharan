import prisma from '@/db';
import { CreateEmployeeExpensesSchema } from '@/schemas';
import { Employee, Expense, Item, Prisma, Supplier } from '@prisma/client';
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

/**
 * Retrieves all unreviewed expenses ordered by creation date descending.
 *
 * @returns {Promise<Expense[]>} - A promise that resolves with an array of unreviewed expenses.
 */
export async function getUnreviewedExpenses(): Promise<Expense[]> {
  const unreviewedExpenses = await prisma.expense.findMany({
    where: { reviewed: false },
    orderBy: { createdAt: 'desc' },
  });
  return unreviewedExpenses;
}

/**
 * Accepts all expenses by marking them as reviewed.
 *
 * @returns {Promise<void>} - A promise that resolves when all expenses are marked as reviewed.
 */
export async function acceptAllExpenses(): Promise<void> {
  await prisma.expense.updateMany({
    where: { reviewed: false },
    data: { reviewed: true },
  });
}

/**
 * Rejects all expenses by marking them as reviewed and not accepted.
 *
 * @returns {Promise<void>} - A promise that resolves when all expenses are marked as reviewed and not accepted.
 */
export async function rejectAllExpenses(): Promise<void> {
  await prisma.expense.updateMany({
    where: { reviewed: false },
    data: { reviewed: true, accepted: false },
  });
}

/**
 * Accepts an expense by its ID, marking it as reviewed and accepted.
 *
 * @param {string} expenseId - The ID of the expense to accept.
 * @returns {Promise<Expense | null>} - A promise that resolves with the accepted expense if found, otherwise null.
 */
export async function acceptExpenseById(expenseId: string): Promise<Expense | null> {
  const expense = await prisma.expense.update({
    where: { id: expenseId },
    data: { reviewed: true, accepted: true },
  });
  return expense;
}

/**
 * Rejects an expense by its ID, marking it as reviewed but not accepted.
 *
 * @param {string} expenseId - The ID of the expense to reject.
 * @returns {Promise<Expense | null>} - A promise that resolves with the rejected expense if found, otherwise null.
 */
export async function rejectExpenseById(expenseId: string): Promise<Expense | null> {
  const expense = await prisma.expense.update({
    where: { id: expenseId },
    data: { reviewed: true, accepted: false },
  });
  return expense;
}
