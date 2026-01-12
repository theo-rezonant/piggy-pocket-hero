/**
 * Lazy-loaded Chart component wrapper.
 *
 * This module dynamically imports recharts (~45KB gzipped)
 * only when charts are actually rendered, reducing initial bundle size.
 *
 * Requires Recharts v3.x+ for React 18 Concurrent Mode compatibility
 * and to resolve findDOMNode deprecation warnings.
 *
 * Usage:
 * ```tsx
 * import { Suspense } from "react";
 * import { LazyChartContainer, ChartSkeleton } from "@/components/ui/lazy/LazyChart";
 *
 * <Suspense fallback={<ChartSkeleton />}>
 *   <LazyChartContainer config={chartConfig}>
 *     <BarChart data={data}>...</BarChart>
 *   </LazyChartContainer>
 * </Suspense>
 * ```
 */

import { lazy, Suspense, type ComponentProps } from "react";
import { Skeleton } from "@/components/ui/skeleton";

// Dynamic imports for code-splitting
const ChartModule = () => import("@/components/ui/chart");

// Lazy components
const ChartContainer = lazy(() => ChartModule().then((m) => ({ default: m.ChartContainer })));
const ChartTooltip = lazy(() => ChartModule().then((m) => ({ default: m.ChartTooltip })));
const ChartTooltipContent = lazy(() => ChartModule().then((m) => ({ default: m.ChartTooltipContent })));
const ChartLegend = lazy(() => ChartModule().then((m) => ({ default: m.ChartLegend })));
const ChartLegendContent = lazy(() => ChartModule().then((m) => ({ default: m.ChartLegendContent })));

// Skeleton fallback for charts
export const ChartSkeleton = ({ className = "", height = "300px" }: { className?: string; height?: string }) => (
  <div className={`flex flex-col ${className}`} style={{ height }}>
    <div className="flex-1 flex items-end justify-between gap-2 p-4">
      {/* Simulated bar chart skeleton */}
      {[40, 60, 30, 80, 50, 70, 45, 65].map((h, i) => (
        <Skeleton key={i} className="flex-1" style={{ height: `${h}%` }} />
      ))}
    </div>
    <div className="flex justify-center gap-4 mt-2">
      <Skeleton className="h-4 w-16" />
      <Skeleton className="h-4 w-16" />
    </div>
  </div>
);

// Type definitions
type ChartContainerProps = ComponentProps<typeof import("@/components/ui/chart").ChartContainer>;
type ChartTooltipProps = ComponentProps<typeof import("@/components/ui/chart").ChartTooltip>;
type ChartTooltipContentProps = ComponentProps<typeof import("@/components/ui/chart").ChartTooltipContent>;
type ChartLegendProps = ComponentProps<typeof import("@/components/ui/chart").ChartLegend>;
type ChartLegendContentProps = ComponentProps<typeof import("@/components/ui/chart").ChartLegendContent>;

// Lazy wrapper components with built-in Suspense
export const LazyChartContainer = (props: ChartContainerProps) => (
  <Suspense fallback={<ChartSkeleton />}>
    <ChartContainer {...props} />
  </Suspense>
);

export const LazyChartTooltip = (props: ChartTooltipProps) => (
  <Suspense fallback={null}>
    <ChartTooltip {...props} />
  </Suspense>
);

export const LazyChartTooltipContent = (props: ChartTooltipContentProps) => (
  <Suspense fallback={null}>
    <ChartTooltipContent {...props} />
  </Suspense>
);

export const LazyChartLegend = (props: ChartLegendProps) => (
  <Suspense fallback={null}>
    <ChartLegend {...props} />
  </Suspense>
);

export const LazyChartLegendContent = (props: ChartLegendContentProps) => (
  <Suspense fallback={null}>
    <ChartLegendContent {...props} />
  </Suspense>
);

// Re-export type
export type { ChartConfig } from "@/components/ui/chart";

// Also export recharts components lazily for direct use
export const lazyRecharts = {
  BarChart: lazy(() => import("recharts").then((m) => ({ default: m.BarChart }))),
  LineChart: lazy(() => import("recharts").then((m) => ({ default: m.LineChart }))),
  PieChart: lazy(() => import("recharts").then((m) => ({ default: m.PieChart }))),
  AreaChart: lazy(() => import("recharts").then((m) => ({ default: m.AreaChart }))),
  Bar: lazy(() => import("recharts").then((m) => ({ default: m.Bar }))),
  Line: lazy(() => import("recharts").then((m) => ({ default: m.Line }))),
  Pie: lazy(() => import("recharts").then((m) => ({ default: m.Pie }))),
  Area: lazy(() => import("recharts").then((m) => ({ default: m.Area }))),
  XAxis: lazy(() => import("recharts").then((m) => ({ default: m.XAxis }))),
  YAxis: lazy(() => import("recharts").then((m) => ({ default: m.YAxis }))),
  CartesianGrid: lazy(() => import("recharts").then((m) => ({ default: m.CartesianGrid }))),
  Tooltip: lazy(() => import("recharts").then((m) => ({ default: m.Tooltip }))),
  Legend: lazy(() => import("recharts").then((m) => ({ default: m.Legend }))),
  ResponsiveContainer: lazy(() => import("recharts").then((m) => ({ default: m.ResponsiveContainer }))),
};
