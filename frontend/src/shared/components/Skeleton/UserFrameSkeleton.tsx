import { Skeleton } from "../shadcn-ui/skeleton";

export default function UserFrameSkeleton() {
  return (
    <div className="flex items-center space-x-3">
      <div className="flex items-center space-x-4 w-[40px]"></div>
      <div className="flex items-center w-full space-x-4">
        <Skeleton className="relative flex items-center w-[60px] h-[60px] overflow-visible bg-blue-200 rounded-full" />
        <div className="flex-1 min-w-0">
          <Skeleton className="relative flex items-center w-[100px] h-[20px] overflow-visible bg-blue-200 rounded" />
        </div>
      </div>
    </div>
  );
}
