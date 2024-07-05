import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { BarChartIcon, PlusCircledIcon, ViewGridIcon, ViewVerticalIcon } from '@radix-ui/react-icons';
import Link from 'next/link';

export default function ExpenseTrackingPage() {
  return (
    <div className="grid container sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 w-full justify-center  p-4">
      <Card className="hover:shadow-lg transition-shadow duration-300 flex flex-col justify-between items-start">
        <CardHeader>
          <CardTitle className="text-lg font-semibold">Create new expense</CardTitle>
          <CardDescription className="text-sm text-gray-500">Add a new expense record</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-gray-700">Easily create a new expense entry</p>
        </CardContent>
        <CardFooter>
          <Link href={`/dashboard/expense-tracking/create`} className="w-full">
            <Button
              type="button"
              className="w-full flex gap-2 justify-center items-center bg-blue-600 hover:bg-blue-700 text-white py-2 rounded"
            >
              <span>Add new</span>
              <PlusCircledIcon />
            </Button>
          </Link>
        </CardFooter>
      </Card>
      <Card className="hover:shadow-lg transition-shadow duration-300 flex flex-col justify-between items-start">
        <CardHeader>
          <CardTitle className="text-lg font-semibold">Review expenses</CardTitle>
          <CardDescription className="text-sm text-gray-500">Check all recorded expenses</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-gray-700">View and manage your expenses</p>
        </CardContent>
        <CardFooter>
          <Link href={`/dashboard/expense-tracking/edit`} className="w-full">
            <Button
              type="button"
              className="w-full flex gap-2 justify-center items-center bg-green-600 hover:bg-green-700 text-white py-2 rounded"
            >
              <span>Review</span>
              <ViewVerticalIcon />
            </Button>
          </Link>
        </CardFooter>
      </Card>
      <Card className="hover:shadow-lg transition-shadow duration-300 flex flex-col justify-between items-start">
        <CardHeader>
          <CardTitle className="text-lg font-semibold">Today's expenses</CardTitle>
          <CardDescription className="text-sm text-gray-500">Expenses made today</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-gray-700">Track today's spending</p>
        </CardContent>
        <CardFooter>
          <Link href={`/dashboard/expense-tracking/view`} className="w-full">
            <Button
              type="button"
              className="w-full flex gap-2 justify-center items-center bg-purple-600 hover:bg-purple-700 text-white py-2 rounded"
            >
              <span>View</span>
              <ViewGridIcon />
            </Button>
          </Link>
        </CardFooter>
      </Card>
      <Card className="hover:shadow-lg transition-shadow duration-300  flex flex-col justify-between items-start">
        <CardHeader>
          <CardTitle className="text-lg font-semibold">Expense statistics</CardTitle>
          <CardDescription className="text-sm text-gray-500">Overview of your expenses</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-gray-700">Analyze your spending patterns</p>
        </CardContent>
        <CardFooter>
          <Link href={`/dashboard/expense-tracking/statistics`} className="w-full">
            <Button
              type="button"
              className="w-full flex gap-2 justify-center items-center bg-red-600 hover:bg-red-700 text-white py-2 rounded"
            >
              <span>View</span>
              <BarChartIcon />
            </Button>
          </Link>
        </CardFooter>
      </Card>
    </div>
  );
}
