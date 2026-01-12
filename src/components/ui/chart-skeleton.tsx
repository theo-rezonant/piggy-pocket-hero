import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";

interface ChartSkeletonProps extends React.HTMLAttributes<HTMLDivElement> {
  /**
   * The aspect ratio of the chart skeleton.
   * Defaults to "aspect-video" to match the default ChartContainer aspect ratio.
   */
  aspectRatio?: string;
}

/**
 * A skeleton loader component for the chart, used as a fallback
 * while the chart component and recharts library are being lazy-loaded.
 */
function ChartSkeleton({
  className,
  aspectRatio = "aspect-video",
  ...props
}: ChartSkeletonProps) {
  return (
    <div
      className={cn(
        "flex flex-col justify-center items-center gap-4",
        aspectRatio,
        className
      )}
      role="status"
      aria-label="Loading chart..."
      {...props}
    >
      {/* Chart area skeleton */}
      <Skeleton className="w-full h-full min-h-[200px] rounded-lg" />
    </div>
  );
}

export { ChartSkeleton };
