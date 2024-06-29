import { CreateBusinessExpenseForm } from '@/components/dashboard/expense-tracking/create-business-expense-form';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

export default function ExpenseTrackingPage() {
  return (
    <Tabs defaultValue="business" className="w-full">
      <TabsList className="grid w-full grid-cols-2">
        <TabsTrigger value="business">business expense</TabsTrigger>
        <TabsTrigger value="personal">personal</TabsTrigger>
      </TabsList>
      <TabsContent value="business">
        <CreateBusinessExpenseForm />
      </TabsContent>
      <TabsContent value="password">
        <CreateBusinessExpenseForm />
      </TabsContent>
    </Tabs>
  );
}
