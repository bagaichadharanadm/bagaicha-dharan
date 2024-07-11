import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { dashboard_home_page_route } from '@/constants/links';
import { ExclamationTriangleIcon, EyeNoneIcon } from '@radix-ui/react-icons';
import Link from 'next/link';

export function Unauthorized() {
  return (
    <div className="h-full w-full flex flex-col justify-center items-center">
      <Card>
        <CardHeader className="flex flex-col items-start justify-center">
          {/* <CardTitle className="flex justify-center items-center gap-4 text-destructive text-2xl">
            <ExclamationTriangleIcon />
            <span>Unauthorized</span>
          </CardTitle> */}
          <CardDescription className="flex justify-center items-center gap-4">
            <EyeNoneIcon />
            <span>You are unauthorized to view this page.</span>
          </CardDescription>
        </CardHeader>
        <CardContent className="text-sm">Please contact admin shall you require to use these services.</CardContent>
        <CardFooter>
          <Link href={dashboard_home_page_route}>
            <Button type="button" variant={'outline'}>
              Back to home
            </Button>
          </Link>
        </CardFooter>
      </Card>
    </div>
  );
}
