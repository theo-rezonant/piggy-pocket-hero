/**
 * Lazy-loaded UI components for heavy dependencies.
 *
 * These components are dynamically imported to reduce initial bundle size
 * and improve Time to Interactive (TTI) by deferring parsing/execution
 * of heavy third-party libraries until they are actually needed.
 *
 * Heavy dependencies:
 * - Carousel: embla-carousel-react (~15KB gzipped)
 * - Chart: recharts (~45KB gzipped)
 * - Command: cmdk (~8KB gzipped)
 *
 * Usage:
 * ```tsx
 * import { LazyCarousel, LazyChartContainer, LazyCommand } from "@/components/ui/lazy";
 *
 * // Components include built-in Suspense with skeleton fallbacks
 * <LazyCarousel>
 *   <LazyCarousel.Content>
 *     <LazyCarousel.Item>Slide 1</LazyCarousel.Item>
 *   </LazyCarousel.Content>
 * </LazyCarousel>
 * ```
 */

// Carousel (embla-carousel-react)
export { LazyCarousel, CarouselSkeleton } from "./LazyCarousel";
export type { CarouselApi } from "./LazyCarousel";

// Chart (recharts)
export {
  LazyChartContainer,
  LazyChartTooltip,
  LazyChartTooltipContent,
  LazyChartLegend,
  LazyChartLegendContent,
  ChartSkeleton,
  lazyRecharts,
} from "./LazyChart";
export type { ChartConfig } from "./LazyChart";

// Command (cmdk)
export {
  LazyCommand,
  CommandSkeleton,
  LazyCommandBase,
  LazyCommandDialog,
  LazyCommandInput,
  LazyCommandList,
  LazyCommandEmpty,
  LazyCommandGroup,
  LazyCommandItem,
  LazyCommandShortcut,
  LazyCommandSeparator,
} from "./LazyCommand";
