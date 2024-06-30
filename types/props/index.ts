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

export type ExpenseLogFormProps = {
  data: {
    id: string;
    tranDate: Date;
    supplierId: string;
    supplierName: string; // Assuming you have supplierName in your data
    employeeId: string;
    employeeName: string;
    itemId: string;
    itemName: string; // Assuming you have itemName in your data
    quantity: number;
    amount: number;
    invoice: number;
    paymentType: string;
    paymentStatus: string;
    comment: string;
  }[];
};
