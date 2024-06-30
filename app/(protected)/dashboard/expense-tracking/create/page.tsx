import { CreateExpenseForm } from '@/components/dashboard/expense-tracking/create-expense-form';
import { itemServices, supplierServices } from '@/services';

export default async function ExpenseTrackingPage() {
  const suppliers = await supplierServices.getAllSupplierNamesAndIds();
  const suppliers_ = await supplierServices.getAllSuppliers();
  const items = await itemServices.getAllItemNamesAndIds();

  return (
    <div className="space-y-6">
      <CreateExpenseForm suppliers={suppliers} items={items} />
    </div>
  );
}
