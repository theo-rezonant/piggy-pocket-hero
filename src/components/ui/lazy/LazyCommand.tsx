/**
 * Lazy-loaded Command component wrapper.
 *
 * This module dynamically imports cmdk (~8KB gzipped)
 * only when the command palette is actually rendered, reducing initial bundle size.
 *
 * Usage:
 * ```tsx
 * import { Suspense } from "react";
 * import { LazyCommand, CommandSkeleton } from "@/components/ui/lazy/LazyCommand";
 *
 * <Suspense fallback={<CommandSkeleton />}>
 *   <LazyCommand>
 *     <LazyCommand.Input placeholder="Search..." />
 *     <LazyCommand.List>
 *       <LazyCommand.Group heading="Actions">
 *         <LazyCommand.Item>Action 1</LazyCommand.Item>
 *       </LazyCommand.Group>
 *     </LazyCommand.List>
 *   </LazyCommand>
 * </Suspense>
 * ```
 */

import { lazy, Suspense, type ComponentProps } from "react";
import { Skeleton } from "@/components/ui/skeleton";

// Dynamic imports for code-splitting
const CommandModule = () => import("@/components/ui/command");

// Lazy components
const Command = lazy(() => CommandModule().then((m) => ({ default: m.Command })));
const CommandDialog = lazy(() => CommandModule().then((m) => ({ default: m.CommandDialog })));
const CommandInput = lazy(() => CommandModule().then((m) => ({ default: m.CommandInput })));
const CommandList = lazy(() => CommandModule().then((m) => ({ default: m.CommandList })));
const CommandEmpty = lazy(() => CommandModule().then((m) => ({ default: m.CommandEmpty })));
const CommandGroup = lazy(() => CommandModule().then((m) => ({ default: m.CommandGroup })));
const CommandItem = lazy(() => CommandModule().then((m) => ({ default: m.CommandItem })));
const CommandShortcut = lazy(() => CommandModule().then((m) => ({ default: m.CommandShortcut })));
const CommandSeparator = lazy(() => CommandModule().then((m) => ({ default: m.CommandSeparator })));

// Skeleton fallback for command palette
export const CommandSkeleton = ({ className = "" }: { className?: string }) => (
  <div className={`rounded-lg border bg-popover p-2 ${className}`}>
    {/* Input skeleton */}
    <div className="flex items-center border-b px-3 pb-2">
      <Skeleton className="h-4 w-4 mr-2" />
      <Skeleton className="h-8 flex-1" />
    </div>
    {/* List skeleton */}
    <div className="p-2 space-y-1">
      <Skeleton className="h-4 w-24 mb-2" />
      {[1, 2, 3].map((i) => (
        <Skeleton key={i} className="h-8 w-full" />
      ))}
    </div>
  </div>
);

// Type definitions
type CommandProps = ComponentProps<typeof import("@/components/ui/command").Command>;
type CommandDialogProps = ComponentProps<typeof import("@/components/ui/command").CommandDialog>;
type CommandInputProps = ComponentProps<typeof import("@/components/ui/command").CommandInput>;
type CommandListProps = ComponentProps<typeof import("@/components/ui/command").CommandList>;
type CommandEmptyProps = ComponentProps<typeof import("@/components/ui/command").CommandEmpty>;
type CommandGroupProps = ComponentProps<typeof import("@/components/ui/command").CommandGroup>;
type CommandItemProps = ComponentProps<typeof import("@/components/ui/command").CommandItem>;
type CommandShortcutProps = ComponentProps<typeof import("@/components/ui/command").CommandShortcut>;
type CommandSeparatorProps = ComponentProps<typeof import("@/components/ui/command").CommandSeparator>;

// Compound component pattern for lazy command
export const LazyCommand = Object.assign(
  (props: CommandProps) => (
    <Suspense fallback={<CommandSkeleton />}>
      <Command {...props} />
    </Suspense>
  ),
  {
    Dialog: (props: CommandDialogProps) => (
      <Suspense fallback={null}>
        <CommandDialog {...props} />
      </Suspense>
    ),
    Input: (props: CommandInputProps) => (
      <Suspense fallback={null}>
        <CommandInput {...props} />
      </Suspense>
    ),
    List: (props: CommandListProps) => (
      <Suspense fallback={null}>
        <CommandList {...props} />
      </Suspense>
    ),
    Empty: (props: CommandEmptyProps) => (
      <Suspense fallback={null}>
        <CommandEmpty {...props} />
      </Suspense>
    ),
    Group: (props: CommandGroupProps) => (
      <Suspense fallback={null}>
        <CommandGroup {...props} />
      </Suspense>
    ),
    Item: (props: CommandItemProps) => (
      <Suspense fallback={null}>
        <CommandItem {...props} />
      </Suspense>
    ),
    Shortcut: (props: CommandShortcutProps) => (
      <Suspense fallback={null}>
        <CommandShortcut {...props} />
      </Suspense>
    ),
    Separator: (props: CommandSeparatorProps) => (
      <Suspense fallback={null}>
        <CommandSeparator {...props} />
      </Suspense>
    ),
  }
);

// Also export individual lazy components for more control
export {
  Command as LazyCommandBase,
  CommandDialog as LazyCommandDialog,
  CommandInput as LazyCommandInput,
  CommandList as LazyCommandList,
  CommandEmpty as LazyCommandEmpty,
  CommandGroup as LazyCommandGroup,
  CommandItem as LazyCommandItem,
  CommandShortcut as LazyCommandShortcut,
  CommandSeparator as LazyCommandSeparator,
};
