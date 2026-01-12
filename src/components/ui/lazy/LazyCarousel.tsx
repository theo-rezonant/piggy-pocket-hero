/**
 * Lazy-loaded Carousel component wrapper.
 *
 * This module dynamically imports embla-carousel-react (~15KB gzipped)
 * only when the carousel is actually rendered, reducing initial bundle size.
 *
 * Usage:
 * ```tsx
 * import { Suspense } from "react";
 * import { LazyCarousel } from "@/components/ui/lazy/LazyCarousel";
 *
 * <Suspense fallback={<CarouselSkeleton />}>
 *   <LazyCarousel>
 *     <LazyCarousel.Content>
 *       <LazyCarousel.Item>Slide 1</LazyCarousel.Item>
 *       <LazyCarousel.Item>Slide 2</LazyCarousel.Item>
 *     </LazyCarousel.Content>
 *     <LazyCarousel.Previous />
 *     <LazyCarousel.Next />
 *   </LazyCarousel>
 * </Suspense>
 * ```
 */

import { lazy, Suspense, type ComponentProps } from "react";
import { Skeleton } from "@/components/ui/skeleton";

// Dynamic imports for code-splitting
const CarouselModule = () => import("@/components/ui/carousel");

// Lazy components
const Carousel = lazy(() => CarouselModule().then((m) => ({ default: m.Carousel })));
const CarouselContent = lazy(() => CarouselModule().then((m) => ({ default: m.CarouselContent })));
const CarouselItem = lazy(() => CarouselModule().then((m) => ({ default: m.CarouselItem })));
const CarouselPrevious = lazy(() => CarouselModule().then((m) => ({ default: m.CarouselPrevious })));
const CarouselNext = lazy(() => CarouselModule().then((m) => ({ default: m.CarouselNext })));

// Skeleton fallback for carousel
export const CarouselSkeleton = ({ className = "" }: { className?: string }) => (
  <div className={`relative ${className}`}>
    <Skeleton className="w-full h-48 rounded-xl" />
    <div className="flex justify-center gap-2 mt-4">
      <Skeleton className="w-8 h-8 rounded-full" />
      <Skeleton className="w-8 h-8 rounded-full" />
    </div>
  </div>
);

// Type definitions for lazy carousel
type CarouselProps = ComponentProps<typeof import("@/components/ui/carousel").Carousel>;
type CarouselContentProps = ComponentProps<typeof import("@/components/ui/carousel").CarouselContent>;
type CarouselItemProps = ComponentProps<typeof import("@/components/ui/carousel").CarouselItem>;
type CarouselPreviousProps = ComponentProps<typeof import("@/components/ui/carousel").CarouselPrevious>;
type CarouselNextProps = ComponentProps<typeof import("@/components/ui/carousel").CarouselNext>;

// Compound component pattern for lazy carousel
export const LazyCarousel = Object.assign(
  (props: CarouselProps) => (
    <Suspense fallback={<CarouselSkeleton />}>
      <Carousel {...props} />
    </Suspense>
  ),
  {
    Content: (props: CarouselContentProps) => (
      <Suspense fallback={null}>
        <CarouselContent {...props} />
      </Suspense>
    ),
    Item: (props: CarouselItemProps) => (
      <Suspense fallback={null}>
        <CarouselItem {...props} />
      </Suspense>
    ),
    Previous: (props: CarouselPreviousProps) => (
      <Suspense fallback={null}>
        <CarouselPrevious {...props} />
      </Suspense>
    ),
    Next: (props: CarouselNextProps) => (
      <Suspense fallback={null}>
        <CarouselNext {...props} />
      </Suspense>
    ),
  }
);

// Re-export type
export type { CarouselApi } from "@/components/ui/carousel";
