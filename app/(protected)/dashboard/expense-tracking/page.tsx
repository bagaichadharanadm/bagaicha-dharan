import { CreateSupplierExpenseForm } from '@/components/dashboard/expense-tracking/supplier/create-supplier-expense-form';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

export default function ExpenseTrackingPage() {
  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Create new expense</CardTitle>
        <CardDescription>Add a new expense to your list</CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="business" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="business">business expense</TabsTrigger>
            <TabsTrigger value="personal">personal</TabsTrigger>
          </TabsList>
          <TabsContent value="business">
            <CreateSupplierExpenseForm />
          </TabsContent>
          <TabsContent value="password">
            <CreateSupplierExpenseForm />
          </TabsContent>
        </Tabs>
      </CardContent>
      <CardFooter className="flex justify-between"></CardFooter>
    </Card>
  );
}
