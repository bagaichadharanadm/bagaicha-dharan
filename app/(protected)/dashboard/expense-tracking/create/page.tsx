import { CreateEmployeeExpenseForm } from '@/components/dashboard/expense-tracking/create-employee-expense-form';
import { employeeServices, itemServices, supplierServices } from '@/services';
import { Suspense } from 'react';

export default async function ExpenseTrackingPage() {
  const suppliers = await supplierServices.getAllSupplierNamesAndIds();
  const items = await itemServices.getAllItemNamesAndIds();
  const employees = await employeeServices.getAllEmployees();
  if (suppliers.length === 0 || items.length === 0 || employees.length === 0) {
    return <div>Expense creation is currently unavailable</div>;
  }
  return (
    <div className="space-y-6">
      <CreateEmployeeExpenseForm suppliers={suppliers} items={items} employees={employees} />
    </div>
  );
}
