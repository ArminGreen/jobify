import { Skeleton } from "@/components/ui/skeleton";

function loading() {
  return (
    <div className=" mb-16 p-8 grid sm:grid-cols-2 md:grid-cols-3 gap-4 rounded-md">
      <SearchSkeleton />
      <SearchSkeleton />
      <SearchSkeleton />
    </div>
  );
}

export function SearchSkeleton() {
  return (
    <div className="flex items-center space-x-4">
      <div className="space-y-2">
        <Skeleton className="h-12 w-[250px] rounded-lg" />
      </div>
    </div>
  );
}
export default loading;
