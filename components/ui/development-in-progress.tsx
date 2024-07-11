import { Progress } from '@/components/ui/progress';

export function DevelopmentInProgress({ title }: { title: string }) {
  return (
    <div className="flex flex-col gap-4 justify-center items-center h-full w-full border rounded-md bg-secondary">
      <h1 className="text-3xl font-semibold text-gray-800 ">Development in progress...</h1>
      <h3 className="text-lg font-medium text-gray-600">{title} is currently being worked upon.</h3>
      <Progress value={50} className="w-[60%]" />
    </div>
  );
}
