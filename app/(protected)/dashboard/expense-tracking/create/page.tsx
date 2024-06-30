import { CreateExpenseForm } from '@/components/dashboard/expense-tracking/create-expense-form';

export default function ExpenseTrackingPage() {
  return (
    <div className="space-y-6">
      <h1 className="text-2xl">Add expense</h1>
      <CreateExpenseForm />
    </div>
  );
}
