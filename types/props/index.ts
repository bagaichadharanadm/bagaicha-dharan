import { Expense } from '@prisma/client';

export type ExpenseTableProps = {
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
    comment: string | null;
    createdAt: Date;
    status: string;
  }[];
};

export type CreateEmployeeExpenseFormProps = {
  suppliers: { id: string; name: string }[];
  items: { id: string; name: string }[];
  employees: { id: string; name: string }[];
};

export type EditEmployeeExpenseFormProps = {
  expenses: Expense[];
  suppliers: { id: string; name: string }[];
  items: { id: string; name: string }[];
  employees: { id: string; name: string }[];
};

export type DailyExpenseFormProps = {
  expenses: {
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
};
