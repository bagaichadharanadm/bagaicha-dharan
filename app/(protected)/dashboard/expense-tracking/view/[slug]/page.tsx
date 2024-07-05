import { expenseTrackingActions } from '@/actions';
import { DailyExpenseForm } from '@/components/dashboard/expense-tracking/view-daily-expense-form';
import { expenseServices } from '@/services';

export default async function DailyExpensesPage({ params }: { params: { slug: string } }) {
  const expenses = await expenseServices.getDailyExpenses({
    tranDate: params.slug,
    // For future development
    take: 5,
    skip: 5,
  });
  if (expenses.length === 0) {
    return <div>There are no new expenses</div>;
  }

  return (
    <div>
      <DailyExpenseForm expenses={expenses} />
    </div>
  );
}
