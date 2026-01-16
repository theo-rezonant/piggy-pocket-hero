import * as React from "react";
import { cn } from "@/lib/utils";
import { useIsMobile } from "@/hooks/use-mobile";
import { Skeleton } from "@/components/ui/skeleton";

/**
 * Constants for sidebar dimensions (must match sidebar.tsx)
 * These are duplicated here to provide consistent fallback sizing
 * without importing the heavy sidebar module.
 */
const SIDEBAR_WIDTH = "16rem";
const SIDEBAR_WIDTH_ICON = "3rem";

/**
 * Lazy-loaded Sidebar components using React.lazy()
 * These are code-split into a separate chunk by Vite.
 */
const LazySidebarModule = React.lazy(() => import("@/components/ui/sidebar"));

/**
 * Individual lazy component factory
 * Creates named lazy imports for each sidebar component
 */
function createLazyComponent<T extends React.ComponentType<object>>(
  componentName: keyof typeof import("@/components/ui/sidebar"),
) {
  return React.lazy(() =>
    import("@/components/ui/sidebar").then((module) => ({
      default: module[componentName] as T,
    })),
  );
}

// Lazy-loaded individual components
export const LazySidebar = createLazyComponent("Sidebar");
export const LazySidebarProvider = createLazyComponent("SidebarProvider");
export const LazySidebarTrigger = createLazyComponent("SidebarTrigger");
export const LazySidebarRail = createLazyComponent("SidebarRail");
export const LazySidebarInset = createLazyComponent("SidebarInset");
export const LazySidebarContent = createLazyComponent("SidebarContent");
export const LazySidebarHeader = createLazyComponent("SidebarHeader");
export const LazySidebarFooter = createLazyComponent("SidebarFooter");
export const LazySidebarGroup = createLazyComponent("SidebarGroup");
export const LazySidebarGroupLabel = createLazyComponent("SidebarGroupLabel");
export const LazySidebarGroupAction = createLazyComponent("SidebarGroupAction");
export const LazySidebarGroupContent = createLazyComponent("SidebarGroupContent");
export const LazySidebarMenu = createLazyComponent("SidebarMenu");
export const LazySidebarMenuItem = createLazyComponent("SidebarMenuItem");
export const LazySidebarMenuButton = createLazyComponent("SidebarMenuButton");
export const LazySidebarMenuAction = createLazyComponent("SidebarMenuAction");
export const LazySidebarMenuBadge = createLazyComponent("SidebarMenuBadge");
export const LazySidebarMenuSkeleton = createLazyComponent("SidebarMenuSkeleton");
export const LazySidebarMenuSub = createLazyComponent("SidebarMenuSub");
export const LazySidebarMenuSubItem = createLazyComponent("SidebarMenuSubItem");
export const LazySidebarMenuSubButton = createLazyComponent("SidebarMenuSubButton");
export const LazySidebarInput = createLazyComponent("SidebarInput");
export const LazySidebarSeparator = createLazyComponent("SidebarSeparator");

/**
 * SidebarSkeleton - A lightweight placeholder that matches the sidebar's dimensions
 * Used as a Suspense fallback to prevent layout shift during lazy loading.
 *
 * @param collapsed - Whether to show collapsed (icon-only) or expanded state
 * @param side - Which side the sidebar appears on ("left" | "right")
 */
interface SidebarSkeletonProps {
  collapsed?: boolean;
  side?: "left" | "right";
  className?: string;
}

export function SidebarSkeleton({ collapsed = false, side = "left", className }: SidebarSkeletonProps) {
  const width = collapsed ? SIDEBAR_WIDTH_ICON : SIDEBAR_WIDTH;

  return (
    <div
      data-sidebar-skeleton="true"
      data-side={side}
      className={cn("hidden text-sidebar-foreground md:block", className)}
      style={{ width }}
    >
      {/* Spacer div for layout consistency */}
      <div
        className="relative h-svh bg-transparent transition-[width] duration-200 ease-linear"
        style={{ width }}
      />
      {/* Visual skeleton representation */}
      <div
        className={cn(
          "fixed inset-y-0 z-10 hidden h-svh transition-[left,right,width] duration-200 ease-linear md:flex",
          side === "left" ? "left-0 border-r" : "right-0 border-l",
        )}
        style={{ width }}
      >
        <div className="flex h-full w-full flex-col bg-sidebar p-2">
          {/* Header skeleton */}
          <div className="flex flex-col gap-2 p-2">
            <Skeleton className="h-8 w-full" />
          </div>
          {/* Content skeleton */}
          <div className="flex-1 overflow-hidden p-2">
            <div className="space-y-2">
              {[...Array(6)].map((_, i) => (
                <Skeleton key={i} className="h-8 w-full" />
              ))}
            </div>
          </div>
          {/* Footer skeleton */}
          <div className="flex flex-col gap-2 p-2">
            <Skeleton className="h-10 w-full" />
          </div>
        </div>
      </div>
    </div>
  );
}

SidebarSkeleton.displayName = "SidebarSkeleton";

/**
 * useDeferredSidebar - Hook for conditionally loading the sidebar on mobile
 *
 * On mobile viewports (< 768px), this hook defers sidebar loading until
 * the user explicitly triggers it (e.g., by clicking a menu button).
 * On desktop, the sidebar loads immediately.
 *
 * @returns {Object} - { shouldLoad, triggerLoad, isMobile }
 */
export function useDeferredSidebar() {
  const isMobile = useIsMobile();
  const [mobileTriggered, setMobileTriggered] = React.useState(false);

  // On desktop, always load. On mobile, wait for user interaction.
  const shouldLoad = !isMobile || mobileTriggered;

  const triggerLoad = React.useCallback(() => {
    setMobileTriggered(true);
  }, []);

  // Reset trigger state when switching from mobile to desktop
  React.useEffect(() => {
    if (!isMobile) {
      setMobileTriggered(false);
    }
  }, [isMobile]);

  return {
    shouldLoad,
    triggerLoad,
    isMobile,
  };
}

/**
 * DeferredSidebarWrapper - Wrapper component for conditionally rendering sidebar
 *
 * This component handles the lazy loading logic and provides a consistent
 * fallback experience. On mobile, it only loads when triggered.
 */
interface DeferredSidebarWrapperProps {
  children: React.ReactNode;
  fallback?: React.ReactNode;
  collapsed?: boolean;
  side?: "left" | "right";
}

export function DeferredSidebarWrapper({
  children,
  fallback,
  collapsed = false,
  side = "left",
}: DeferredSidebarWrapperProps) {
  const { shouldLoad, isMobile } = useDeferredSidebar();

  // On mobile, don't render anything until triggered
  // The sidebar will use Sheet component which doesn't need a placeholder
  if (isMobile && !shouldLoad) {
    return null;
  }

  const defaultFallback = <SidebarSkeleton collapsed={collapsed} side={side} />;

  return <React.Suspense fallback={fallback ?? defaultFallback}>{children}</React.Suspense>;
}

DeferredSidebarWrapper.displayName = "DeferredSidebarWrapper";

/**
 * SidebarTriggerButton - Lightweight trigger button for mobile
 *
 * This can be used to trigger sidebar loading on mobile without
 * importing the full sidebar module. It's styled to match SidebarTrigger.
 */
interface SidebarTriggerButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  onTrigger?: () => void;
}

export const SidebarTriggerButton = React.forwardRef<HTMLButtonElement, SidebarTriggerButtonProps>(
  ({ className, onTrigger, onClick, ...props }, ref) => {
    const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
      onClick?.(event);
      onTrigger?.();
    };

    return (
      <button
        ref={ref}
        data-sidebar="trigger-placeholder"
        className={cn(
          "inline-flex h-7 w-7 items-center justify-center rounded-md hover:bg-accent hover:text-accent-foreground",
          className,
        )}
        onClick={handleClick}
        aria-label="Toggle Sidebar"
        {...props}
      >
        {/* PanelLeft icon inline to avoid lucide-react import */}
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="16"
          height="16"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <rect width="18" height="18" x="3" y="3" rx="2" />
          <path d="M9 3v18" />
        </svg>
      </button>
    );
  },
);

SidebarTriggerButton.displayName = "SidebarTriggerButton";

/**
 * preloadSidebar - Programmatically preload the sidebar chunk
 *
 * Can be called on hover/focus of navigation elements to start
 * loading the sidebar before the user clicks.
 */
export function preloadSidebar(): void {
  // Trigger the dynamic import without rendering
  void import("@/components/ui/sidebar");
}

// Re-export the module for accessing all components at once
export { LazySidebarModule };
