import { Expense } from '@prisma/client';

/**
 * Props for the ExpenseTable component.
 */
export type ExpenseTableProps = {
  /**
   * Array of expense data objects.
   */
  data: {
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
    comment: string;
  }[];

  /**
   * Optional flag to show or hide the table header.
   */
  showHeader?: boolean;
};

/**
 * Props for creating a new employee expense form.
 */
export type CreateEmployeeExpenseFormProps = {
  /**
   * Array of supplier options with id and name.
   */
  suppliers: { id: string; name: string }[];

  /**
   * Array of item options with id and name.
   */
  items: { id: string; name: string }[];

  /**
   * Array of employee options with id and name.
   */
  employees: { id: string; name: string }[];
};

/**
 * Props for editing existing employee expenses.
 */
export type EditEmployeeExpenseFormProps = {
  /**
   * Array of existing expenses fetched from the database.
   */
  expenses: Expense[];
  /**
   * Array of supplier options with id and name.
   */
  suppliers: { id: string; name: string }[];

  /**
   * Array of item options with id and name.
   */
  items: { id: string; name: string }[];

  /**
   * Array of employee options with id and name.
   */
  employees: { id: string; name: string }[];
};
