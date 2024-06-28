import { RegisterForm } from '@/components/auth/register-form';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import Link from 'next/link';

export default function Register() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Register</CardTitle>
        <CardDescription>Create an account</CardDescription>
      </CardHeader>
      <CardContent>
        <RegisterForm />
      </CardContent>
      <CardFooter className="flex flex-col justify-center items-center">
        <Link href={`/auth/login`}>
          <p className="text-sm text-sky-900 hover:underline focus:underline hover:underline-offset-4 focus:underline-offset-4 hover:cursor-pointer focus:cursor-pointer">
            I already have an account.
          </p>
        </Link>
      </CardFooter>
    </Card>
  );
}
