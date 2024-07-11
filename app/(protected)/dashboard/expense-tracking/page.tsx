import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import getUserSessionAndRole from '@/lib/get-user-session-and-role';
import { BarChartIcon, PlusCircledIcon, ViewGridIcon, ViewVerticalIcon } from '@radix-ui/react-icons';
import Link from 'next/link';
import { redirect } from 'next/navigation';

export default async function ExpenseTrackingPage() {
  const user = await getUserSessionAndRole();

  if (!user.isSignedIn) {
    redirect('/auth/login');
  }

  return (
    <div className="container mx-auto p-4">
      <header className="text-center mb-8">
        <h1 className="text-3xl font-bold">Expense Tracking Dashboard</h1>
        <p className="text-gray-700 mt-2">
          Manage and track your restaurant's expenses efficiently. Create new entries, review past records, and analyze
          your spending patterns all in one place.
        </p>
      </header>

      <div className="grid xs:grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 w-full justify-center">
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
                className="flex gap-2 justify-center items-center bg-blue-600 text-white hover:bg-blue-700 w-40"
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
                className="flex gap-2 justify-center items-center bg-green-600 text-white hover:bg-green-700 w-40"
                disabled={!(user.role === 'ADMIN')}
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
                className="flex gap-2 justify-center items-center bg-yellow-600 text-white hover:bg-yellow-700 w-40"
              >
                <span>View</span>
                <ViewGridIcon />
              </Button>
            </Link>
          </CardFooter>
        </Card>
        <Card className="hover:shadow-lg transition-shadow duration-300 flex flex-col justify-between items-start">
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
                className="flex gap-2 justify-center items-center bg-red-600 text-white hover:bg-red-700 w-40"
              >
                <span>View</span>
                <BarChartIcon />
              </Button>
            </Link>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
}
