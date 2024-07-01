import { EditEmployeeExpenseForm } from '@/components/dashboard/expense-tracking/edit-employee-expense-form';
import { employeeServices, expenseServices, itemServices, supplierServices } from '@/services';

export default async function ViewUnreviewedExpensesPage() {
  const expenses = await expenseServices.getUnreviewedExpenses();
  const suppliers = await supplierServices.getAllSupplierNamesAndIds();
  const items = await itemServices.getAllItemNamesAndIds();
  const employees = await employeeServices.getAllEmployees();
  if (expenses.length === 0 || suppliers.length === 0 || items.length === 0 || employees.length === 0) {
    return <div>There are no new expenses.</div>;
  }

  return (
    <div>
      <EditEmployeeExpenseForm expenses={expenses} suppliers={suppliers} items={items} employees={employees} />
    </div>
  );
}
