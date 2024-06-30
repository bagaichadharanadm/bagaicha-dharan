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
    comment: string;
  }[];
  showHeader?: boolean;
};

export type CreateEmployeeExpenseFormProps = {
  suppliers: { id: string; name: string }[];
  items: { id: string; name: string }[];
  employees: { id: string; name: string }[];
};
