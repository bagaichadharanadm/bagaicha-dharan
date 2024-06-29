'use client';

import { Table, TableBody, TableCell, TableFooter, TableHead, TableHeader, TableRow } from '@/components/ui/table';

type ExpenseTableProps = {
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

export function ExpenseTable({ data, showHeader = true }: ExpenseTableProps) {
  const formatDate = (date: Date): string => {
    const options: Intl.DateTimeFormatOptions = {
      day: '2-digit',
      month: 'short',
      year: '2-digit',
    };
    return date.toLocaleDateString('en-US', options).toUpperCase();
  };

  // Separate rows with empty id and other rows
  const rowsWithEmptyId = data.filter((expense) => expense.id === '');
  const otherRows = data.filter((expense) => expense.id !== '');

  return (
    <div className="overflow-x-auto">
      <Table className="min-w-full bg-white border border-gray-300">
        {showHeader && (
          <TableHeader>
            <TableRow className="bg-gray-200">
              <TableHead className="px-6 py-3 text-left text-xs font-medium text-gray-800 uppercase tracking-wider border border-gray-300">
                Date
              </TableHead>
              <TableHead className="px-6 py-3 text-left text-xs font-medium text-gray-800 uppercase tracking-wider border border-gray-300">
                Supplier
              </TableHead>
              <TableHead className="px-6 py-3 text-left text-xs font-medium text-gray-800 uppercase tracking-wider border border-gray-300">
                Employee
              </TableHead>
              <TableHead className="px-6 py-3 text-left text-xs font-medium text-gray-800 uppercase tracking-wider border border-gray-300">
                Item
              </TableHead>
              <TableHead className="px-6 py-3 text-left text-xs font-medium text-gray-800 uppercase tracking-wider border border-gray-300">
                Quantity
              </TableHead>
              <TableHead className="px-6 py-3 text-right text-xs font-medium text-gray-800 uppercase tracking-wider border border-gray-300">
                Amount
              </TableHead>
              <TableHead className="px-6 py-3 text-left text-xs font-medium text-gray-800 uppercase tracking-wider border border-gray-300">
                Invoice
              </TableHead>
              <TableHead className="px-6 py-3 text-left text-xs font-medium text-gray-800 uppercase tracking-wider border border-gray-300">
                Method
              </TableHead>
              <TableHead className="px-6 py-3 text-left text-xs font-medium text-gray-800 uppercase tracking-wider border border-gray-300">
                Status
              </TableHead>
              <TableHead className="px-6 py-3 text-left text-xs font-medium text-gray-800 uppercase tracking-wider border border-gray-300">
                Comment
              </TableHead>
            </TableRow>
          </TableHeader>
        )}
        <TableBody>
          {rowsWithEmptyId.map((expense, index) => (
            <TableRow key={index} className="bg-green-100">
              <TableCell className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 border border-gray-300">
                {formatDate(expense.tranDate)}
              </TableCell>
              <TableCell className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 border border-gray-300">
                {expense.supplierName}
              </TableCell>
              <TableCell className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 border border-gray-300">
                {expense.employeeName}
              </TableCell>
              <TableCell className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 border border-gray-300">
                {expense.itemName}
              </TableCell>
              <TableCell className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 border border-gray-300">
                {expense.quantity}
              </TableCell>
              <TableCell className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 text-right border border-gray-300">
                {expense.amount}
              </TableCell>
              <TableCell className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 border border-gray-300">
                {expense.invoice}
              </TableCell>
              <TableCell className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 border border-gray-300">
                {expense.paymentType}
              </TableCell>
              <TableCell className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 border border-gray-300">
                {expense.paymentStatus}
              </TableCell>
              <TableCell className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 border border-gray-300">
                {expense.comment}
              </TableCell>
            </TableRow>
          ))}
          {otherRows.map((expense, index) => (
            <TableRow key={index + rowsWithEmptyId.length} className={index % 2 === 0 ? 'bg-gray-50' : 'bg-white'}>
              <TableCell className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 border border-gray-300">
                {formatDate(expense.tranDate)}
              </TableCell>
              <TableCell className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 border border-gray-300">
                {expense.supplierName}
              </TableCell>
              <TableCell className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 border border-gray-300">
                {expense.employeeName}
              </TableCell>
              <TableCell className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 border border-gray-300">
                {expense.itemName}
              </TableCell>
              <TableCell className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 border border-gray-300">
                {expense.quantity}
              </TableCell>
              <TableCell className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 text-right border border-gray-300">
                {expense.amount}
              </TableCell>
              <TableCell className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 border border-gray-300">
                {expense.invoice}
              </TableCell>
              <TableCell className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 border border-gray-300">
                {expense.paymentType}
              </TableCell>
              <TableCell className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 border border-gray-300">
                {expense.paymentStatus}
              </TableCell>
              <TableCell className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 border border-gray-300">
                {expense.comment}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
        <TableFooter></TableFooter>
      </Table>
    </div>
  );
}
