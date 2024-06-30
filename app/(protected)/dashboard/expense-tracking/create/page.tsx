import { CreateEmployeeExpenseForm } from '@/components/dashboard/expense-tracking/create-employee-expense-form';
import { employeeServices, itemServices, supplierServices } from '@/services';

export default async function ExpenseTrackingPage() {
  const suppliers = await supplierServices.getAllSupplierNamesAndIds();
  const items = await itemServices.getAllItemNamesAndIds();
  const employees = await employeeServices.getAllEmployees();
  return (
    <div className="space-y-6">
      <CreateEmployeeExpenseForm suppliers={suppliers} items={items} employees={employees} />
    </div>
  );
}
