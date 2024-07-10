import { Skeleton } from '@/components/ui/skeleton';

export default function Loading() {
  return (
    <div className="flex items-center space-x-4">
      <Skeleton className="h-[85vh] w-full flex flex-row gap-4 justify-center items-center">
        <div className="space-y-2 text-xs">Loading...</div>
        <div className="flex justify-center items-center">
          <div className="w-4 h-4 border-4 border-t-4 border-gray-800 rounded-full animate-spin"></div>
        </div>
      </Skeleton>
    </div>
  );
}
