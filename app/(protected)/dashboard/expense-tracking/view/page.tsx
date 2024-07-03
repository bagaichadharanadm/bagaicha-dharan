import { ExpenseTable } from '@/components/dashboard/expense-tracking/expense-table';
import { expenseServices } from '@/services';

export default async function ViewDailyExpensesPage() {
  const expenses = await expenseServices.getDailyExpenses('20240703');
  if (expenses.length === 0) {
    return <div>No expenses found for this day</div>;
  }
  return <ExpenseTable data={expenses} />;
}
