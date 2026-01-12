import { Skeleton } from "@/components/ui/skeleton";

interface ChartSkeletonProps {
  aspectRatio?: number;
  className?: string;
}

export function ChartSkeleton({ aspectRatio = 2, className }: ChartSkeletonProps) {
  return (
    <div
      role="status"
      aria-label="Loading chart..."
      className={className}
      style={{ aspectRatio }}
    >
      <Skeleton className="w-full h-full rounded-lg" />
    </div>
  );
}
