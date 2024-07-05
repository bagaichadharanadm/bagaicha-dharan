import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { formatDate } from '@/lib/format-date';
import { ExpenseTableProps } from '@/types/props';

export function ExpenseTable({ data }: ExpenseTableProps) {
  return (
    <Table>
      <TableCaption>A list of expenses.</TableCaption>
      <TableHeader>
        <TableRow>
          <TableHead className="w-[100px]">Employee</TableHead>
          <TableHead>Supplier</TableHead>
          <TableHead>Item</TableHead>
          <TableHead>Payment Type</TableHead>
          <TableHead>Payment Status</TableHead>
          <TableHead>Quantity</TableHead>
          <TableHead>Amount</TableHead>
          <TableHead>Invoice</TableHead>
          <TableHead>Comment</TableHead>
          <TableHead>Created At</TableHead>
          <TableHead>Status</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {data.map((expense) => (
          <TableRow key={expense.id}>
            <TableCell className="font-medium">{expense.employeeName}</TableCell>
            <TableCell>{expense.supplierName}</TableCell>
            <TableCell>{expense.itemName}</TableCell>
            <TableCell>{expense.paymentType}</TableCell>
            <TableCell>{expense.paymentStatus}</TableCell>
            <TableCell>{expense.quantity}</TableCell>
            <TableCell>{expense.amount}</TableCell>
            <TableCell>{expense.invoice}</TableCell>
            <TableCell>{expense.comment}</TableCell>
            <TableCell>{formatDate(expense.createdAt)}</TableCell>
            <TableCell>{expense.status}</TableCell>
          </TableRow>
        ))}
      </TableBody>
      <TableFooter>
        <TableRow></TableRow>
      </TableFooter>
    </Table>
  );
}
