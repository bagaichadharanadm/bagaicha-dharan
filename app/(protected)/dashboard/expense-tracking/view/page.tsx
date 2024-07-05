import { DailyExpenseForm } from '@/components/dashboard/expense-tracking/daily-expense-form';

export default async function DailyExpensesPage({ params }: { params: { slug: string } }) {
  return (
    <div>
      <DailyExpenseForm />
    </div>
  );
}
