import { LoginForm } from '@/components/auth/login-form';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import Link from 'next/link';

export default function Login() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Login</CardTitle>
        <CardDescription>Login to continue</CardDescription>
      </CardHeader>
      <CardContent>
        <LoginForm />
      </CardContent>
      <CardFooter className="flex flex-col justify-center items-center">
        <Link href={`/auth/register`}>
          <p className="text-sm text-sky-900 hover:underline focus:underline hover:underline-offset-4 focus:underline-offset-4 hover:cursor-pointer focus:cursor-pointer">
            I don&apos;t have an account
          </p>
        </Link>
      </CardFooter>
    </Card>
  );
}
