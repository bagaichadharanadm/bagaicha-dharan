import prisma from '@/db';
import { CreateEmployeeExpensesSchema } from '@/schemas';
import { EditEmployeeExpensesSchema } from '@/schemas';
import { Employee, Expense, Item, Prisma, Supplier } from '@prisma/client';
import { PaymentStatus as PaymentStatusEnum, PaymentType as PaymentTypeEnum } from '@prisma/client';
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

/**
 * Updates multiple expense records in the database.
 *
 * @param {z.infer<typeof EditEmployeeExpensesSchema>} data - The data for updating expenses.
 * @returns {Promise<Expense[]>} - A promise that resolves with the updated expenses.
 *
 * @example
 * const data = {
 *   records: [
 *     {
 *       id: 'expense1',
 *       tranDate: new Date(),
 *       itemId: 'newItemId',
 *       supplierId: 'newSupplierId',
 *       employeeId: 'newEmployeeId',
 *       quantity: 5,
 *       amount: 150,
 *       invoice: 56789,
 *       paymentType: 'CASH',
 *       paymentStatus: 'PAID',
 *       comment: 'Updated comment',
 *       reviewed: true,
 *       accepted: true,
 *       createdAt: new Date(),
 *       updatedAt: new Date(),
 *     },
 *     // additional records
 *   ],
 * };
 * const updatedExpenses = await updateExpenses(data);
 */
export async function updateExpenses(data: z.infer<typeof EditEmployeeExpensesSchema>): Promise<Expense[]> {
  const updatedExpenses = await prisma.$transaction(
    data.records.map((record) =>
      prisma.expense.update({
        where: { id: record.id },
        data: {
          transactionDate: record.tranDate,
          itemId: record.itemId,
          supplierId: record.supplierId,
          employeeId: record.employeeId,
          quantity: record.quantity,
          amount: record.amount,
          invoice: record.invoice,
          paymentType: record.paymentType as PaymentTypeEnum,
          paymentStatus: record.paymentStatus as PaymentStatusEnum,
          comments: record.comment,
          reviewed: record.reviewed ?? false,
          accepted: record.accepted ?? false,
          createdAt: record.createdAt,
          updatedAt: record.updatedAt,
        },
      }),
    ),
  );

  return updatedExpenses;
}

export async function getDailyExpenses(tranDate: string) {
  const dailyExpenses = await prisma.$queryRaw`
    select
  expense."id" as "id",
  expense."transactionDate" as "tranDate",
  expense."supplierId" as "supplierId",
  supplier."supplierName" as "supplierName",
  expense."employeeId" as "employeeId",
  employee."name" as "employeeName",
  expense."itemId" as "itemId",
  item."itemDesc" as "itemName",
  expense.quantity as "quantity",
  expense.amount as "amount",
  expense.invoice as "invoice",
  expense."paymentType" as "paymentType",
  expense."paymentStatus" as "paymentStatus",
  expense."comments" as "comments",
  expense."createdAt" as "createdAt",
  case
    when expense.reviewed then 
    case when expense.accepted then 'APPROVED'
    else 'REJECTED' end
    else 'NOT REVIEWED'
  end as "status"
from
  "Expense" as expense
  inner join "Supplier" as supplier on expense."supplierId" = supplier.id
  inner join "Item" as item on expense."itemId" = item.id
  inner join "Employee" as employee on expense."employeeId" = employee.id
where
  to_char(expense."transactionDate", 'YYYYMMDD') = ${tranDate}
  order by expense."updatedAt" desc
  `;
  // Define the return type inline
  return dailyExpenses as {
    id: string;
    tranDate: Date;
    supplierId: string;
    supplierName: string;
    employeeId: string;
    employeeName: string;
    itemId: string;
    itemName: string;
    quantity: number;
    amount: number;
    invoice: number;
    paymentType: string;
    paymentStatus: string;
    comment: string | null;
    createdAt: Date;
    status: string;
  }[];
}
