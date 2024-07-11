import { AdminPage } from '@/components/auth/admin-page';
import { EditEmployeeExpenseForm } from '@/components/dashboard/expense-tracking/edit-employee-expense-form';
import { employeeServices, expenseServices, itemServices, supplierServices } from '@/services';
import { Suspense } from 'react';

export default async function ViewUnreviewedExpensesPage() {
  const expenses = await expenseServices.getUnreviewedExpenses();
  const suppliers = await supplierServices.getAllSupplierNamesAndIds();
  const items = await itemServices.getAllItemNamesAndIds();
  const employees = await employeeServices.getAllEmployees();
  if (expenses.length === 0 || suppliers.length === 0 || items.length === 0 || employees.length === 0) {
    return <div>There are no new expenses.</div>;
  }

  return (
    <div className="h-full">
      <Suspense>
        <AdminPage>
          <EditEmployeeExpenseForm expenses={expenses} suppliers={suppliers} items={items} employees={employees} />
        </AdminPage>
      </Suspense>
    </div>
  );
}
