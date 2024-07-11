import { AdminPage } from '@/components/auth/admin-page';
import { DailyExpenseForm } from '@/components/dashboard/expense-tracking/view-daily-expense-form';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { expenseServices } from '@/services';
import { Suspense } from 'react';

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
    <Suspense>
      <AdminPage>
        <Card>
          <CardHeader>
            <CardTitle>Daily Expenses</CardTitle>
            <CardDescription>A list of your daily expenses</CardDescription>
          </CardHeader>
          <CardContent>
            <DailyExpenseForm expenses={expenses} />
          </CardContent>
          <CardFooter></CardFooter>
        </Card>{' '}
      </AdminPage>
    </Suspense>
  );
}
