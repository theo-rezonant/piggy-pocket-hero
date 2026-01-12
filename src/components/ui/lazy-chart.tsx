import React from "react";
import { ChartSkeleton } from "@/components/ui/chart-skeleton";

/**
 * Lazy-loaded chart module.
 * This dynamically imports the chart component along with the recharts library,
 * ensuring they are loaded in a separate chunk and not included in the main bundle.
 *
 * Usage:
 * ```tsx
 * import { Suspense, lazy } from "react";
 * import { ChartSkeleton } from "@/components/ui/chart-skeleton";
 *
 * const LazyChart = lazy(() => import("@/components/ui/chart"));
 *
 * // In component:
 * <Suspense fallback={<ChartSkeleton />}>
 *   <LazyChart.ChartContainer config={config}>
 *     {children}
 *   </LazyChart.ChartContainer>
 * </Suspense>
 * ```
 */

// Re-export ChartSkeleton for convenience
export { ChartSkeleton } from "@/components/ui/chart-skeleton";

/**
 * Type definitions for the lazy-loaded chart components.
 */
type ChartModuleType = typeof import("@/components/ui/chart");

/**
 * Props for the LazyChartContainer component.
 */
interface LazyChartContainerProps
  extends React.ComponentProps<ChartModuleType["ChartContainer"]> {
  /** Custom fallback to display while loading. Defaults to ChartSkeleton. */
  fallback?: React.ReactNode;
}

/**
 * State type for the lazy chart container hook.
 */
interface UseChartModuleState {
  ChartContainer: ChartModuleType["ChartContainer"] | null;
  ChartTooltip: ChartModuleType["ChartTooltip"] | null;
  ChartTooltipContent: ChartModuleType["ChartTooltipContent"] | null;
  ChartLegend: ChartModuleType["ChartLegend"] | null;
  ChartLegendContent: ChartModuleType["ChartLegendContent"] | null;
  ChartStyle: ChartModuleType["ChartStyle"] | null;
  isLoading: boolean;
  error: Error | null;
}

/**
 * Hook to dynamically load the chart module.
 * Returns the chart components once loaded.
 */
export function useChartModule(): UseChartModuleState {
  const [state, setState] = React.useState<UseChartModuleState>({
    ChartContainer: null,
    ChartTooltip: null,
    ChartTooltipContent: null,
    ChartLegend: null,
    ChartLegendContent: null,
    ChartStyle: null,
    isLoading: true,
    error: null,
  });

  React.useEffect(() => {
    let mounted = true;

    import("@/components/ui/chart")
      .then((module) => {
        if (mounted) {
          setState({
            ChartContainer: module.ChartContainer,
            ChartTooltip: module.ChartTooltip,
            ChartTooltipContent: module.ChartTooltipContent,
            ChartLegend: module.ChartLegend,
            ChartLegendContent: module.ChartLegendContent,
            ChartStyle: module.ChartStyle,
            isLoading: false,
            error: null,
          });
        }
      })
      .catch((err) => {
        if (mounted) {
          setState((prev) => ({
            ...prev,
            isLoading: false,
            error: err instanceof Error ? err : new Error(String(err)),
          }));
        }
      });

    return () => {
      mounted = false;
    };
  }, []);

  return state;
}

/**
 * LazyChartContainer - A wrapper around ChartContainer that lazy-loads the chart component.
 * Automatically wraps itself in a Suspense boundary with a skeleton fallback.
 *
 * @example
 * ```tsx
 * import { LazyChartContainer } from "@/components/ui/lazy-chart";
 * import { BarChart, Bar, XAxis, YAxis } from "recharts";
 *
 * <LazyChartContainer config={chartConfig} className="h-[300px]">
 *   <BarChart data={data}>
 *     <XAxis dataKey="name" />
 *     <YAxis />
 *     <Bar dataKey="value" fill="var(--color-value)" />
 *   </BarChart>
 * </LazyChartContainer>
 * ```
 */
export const LazyChartContainer = React.forwardRef<
  HTMLDivElement,
  LazyChartContainerProps
>(({ fallback, children, ...props }, ref) => {
  const { ChartContainer, isLoading, error } = useChartModule();

  if (error) {
    return (
      <div className="flex items-center justify-center aspect-video text-destructive">
        Failed to load chart
      </div>
    );
  }

  if (isLoading || !ChartContainer) {
    return <>{fallback ?? <ChartSkeleton />}</>;
  }

  return (
    <ChartContainer ref={ref} {...props}>
      {children}
    </ChartContainer>
  );
});
LazyChartContainer.displayName = "LazyChartContainer";

/**
 * Helper component that provides all chart components via render props pattern
 * after lazy-loading the chart module.
 *
 * @example
 * ```tsx
 * import { LazyChartLoader } from "@/components/ui/lazy-chart";
 *
 * <LazyChartLoader fallback={<ChartSkeleton />}>
 *   {({ ChartContainer, ChartTooltip, ChartTooltipContent }) => (
 *     <ChartContainer config={config}>
 *       <BarChart data={data}>
 *         <ChartTooltip content={<ChartTooltipContent />} />
 *       </BarChart>
 *     </ChartContainer>
 *   )}
 * </LazyChartLoader>
 * ```
 */
interface LazyChartLoaderProps {
  children: (components: {
    ChartContainer: ChartModuleType["ChartContainer"];
    ChartTooltip: ChartModuleType["ChartTooltip"];
    ChartTooltipContent: ChartModuleType["ChartTooltipContent"];
    ChartLegend: ChartModuleType["ChartLegend"];
    ChartLegendContent: ChartModuleType["ChartLegendContent"];
    ChartStyle: ChartModuleType["ChartStyle"];
  }) => React.ReactNode;
  fallback?: React.ReactNode;
}

export function LazyChartLoader({
  children,
  fallback,
}: LazyChartLoaderProps): React.ReactElement {
  const {
    ChartContainer,
    ChartTooltip,
    ChartTooltipContent,
    ChartLegend,
    ChartLegendContent,
    ChartStyle,
    isLoading,
    error,
  } = useChartModule();

  if (error) {
    return (
      <div className="flex items-center justify-center aspect-video text-destructive">
        Failed to load chart
      </div>
    );
  }

  if (
    isLoading ||
    !ChartContainer ||
    !ChartTooltip ||
    !ChartTooltipContent ||
    !ChartLegend ||
    !ChartLegendContent ||
    !ChartStyle
  ) {
    return <>{fallback ?? <ChartSkeleton />}</>;
  }

  return (
    <>
      {children({
        ChartContainer,
        ChartTooltip,
        ChartTooltipContent,
        ChartLegend,
        ChartLegendContent,
        ChartStyle,
      })}
    </>
  );
}
