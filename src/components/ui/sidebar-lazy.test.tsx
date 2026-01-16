import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { render, screen, waitFor, act } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import * as React from "react";
import {
  SidebarSkeleton,
  SidebarTriggerButton,
  useDeferredSidebar,
  DeferredSidebarWrapper,
  preloadSidebar,
} from "./sidebar-lazy";

// Mock the useIsMobile hook
vi.mock("@/hooks/use-mobile", () => ({
  useIsMobile: vi.fn(() => false),
}));

import { useIsMobile } from "@/hooks/use-mobile";

const mockedUseIsMobile = vi.mocked(useIsMobile);

describe("SidebarSkeleton", () => {
  it("renders with default props", () => {
    render(<SidebarSkeleton />);
    const skeleton = document.querySelector('[data-sidebar-skeleton="true"]');
    expect(skeleton).toBeInTheDocument();
    expect(skeleton).toHaveAttribute("data-side", "left");
  });

  it("renders with collapsed state", () => {
    render(<SidebarSkeleton collapsed />);
    const skeleton = document.querySelector('[data-sidebar-skeleton="true"]');
    expect(skeleton).toBeInTheDocument();
    // Collapsed width should be 3rem
    expect(skeleton).toHaveStyle({ width: "3rem" });
  });

  it("renders on right side", () => {
    render(<SidebarSkeleton side="right" />);
    const skeleton = document.querySelector('[data-sidebar-skeleton="true"]');
    expect(skeleton).toHaveAttribute("data-side", "right");
  });

  it("applies custom className", () => {
    render(<SidebarSkeleton className="custom-class" />);
    const skeleton = document.querySelector('[data-sidebar-skeleton="true"]');
    expect(skeleton).toHaveClass("custom-class");
  });
});

describe("SidebarTriggerButton", () => {
  it("renders correctly", () => {
    render(<SidebarTriggerButton />);
    const button = screen.getByRole("button", { name: /toggle sidebar/i });
    expect(button).toBeInTheDocument();
    expect(button).toHaveAttribute("data-sidebar", "trigger-placeholder");
  });

  it("calls onTrigger when clicked", async () => {
    const user = userEvent.setup();
    const onTrigger = vi.fn();
    render(<SidebarTriggerButton onTrigger={onTrigger} />);

    const button = screen.getByRole("button");
    await user.click(button);

    expect(onTrigger).toHaveBeenCalledTimes(1);
  });

  it("calls onClick when provided", async () => {
    const user = userEvent.setup();
    const onClick = vi.fn();
    render(<SidebarTriggerButton onClick={onClick} />);

    const button = screen.getByRole("button");
    await user.click(button);

    expect(onClick).toHaveBeenCalledTimes(1);
  });

  it("calls both onClick and onTrigger", async () => {
    const user = userEvent.setup();
    const onClick = vi.fn();
    const onTrigger = vi.fn();
    render(<SidebarTriggerButton onClick={onClick} onTrigger={onTrigger} />);

    const button = screen.getByRole("button");
    await user.click(button);

    expect(onClick).toHaveBeenCalledTimes(1);
    expect(onTrigger).toHaveBeenCalledTimes(1);
  });

  it("forwards ref", () => {
    const ref = React.createRef<HTMLButtonElement>();
    render(<SidebarTriggerButton ref={ref} />);
    expect(ref.current).toBeInstanceOf(HTMLButtonElement);
  });
});

describe("useDeferredSidebar", () => {
  beforeEach(() => {
    mockedUseIsMobile.mockReturnValue(false);
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  // Helper component to test the hook
  function TestComponent() {
    const { shouldLoad, triggerLoad, isMobile } = useDeferredSidebar();
    return (
      <div>
        <span data-testid="should-load">{shouldLoad.toString()}</span>
        <span data-testid="is-mobile">{isMobile.toString()}</span>
        <button onClick={triggerLoad}>Trigger</button>
      </div>
    );
  }

  it("returns shouldLoad=true on desktop", () => {
    mockedUseIsMobile.mockReturnValue(false);
    render(<TestComponent />);

    expect(screen.getByTestId("should-load")).toHaveTextContent("true");
    expect(screen.getByTestId("is-mobile")).toHaveTextContent("false");
  });

  it("returns shouldLoad=false on mobile initially", () => {
    mockedUseIsMobile.mockReturnValue(true);
    render(<TestComponent />);

    expect(screen.getByTestId("should-load")).toHaveTextContent("false");
    expect(screen.getByTestId("is-mobile")).toHaveTextContent("true");
  });

  it("returns shouldLoad=true on mobile after trigger", async () => {
    const user = userEvent.setup();
    mockedUseIsMobile.mockReturnValue(true);
    render(<TestComponent />);

    expect(screen.getByTestId("should-load")).toHaveTextContent("false");

    await user.click(screen.getByRole("button"));

    expect(screen.getByTestId("should-load")).toHaveTextContent("true");
  });
});

describe("DeferredSidebarWrapper", () => {
  beforeEach(() => {
    mockedUseIsMobile.mockReturnValue(false);
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  it("renders children on desktop", async () => {
    render(
      <DeferredSidebarWrapper>
        <div data-testid="content">Content</div>
      </DeferredSidebarWrapper>,
    );

    await waitFor(() => {
      expect(screen.getByTestId("content")).toBeInTheDocument();
    });
  });

  it("renders nothing on mobile without trigger", () => {
    mockedUseIsMobile.mockReturnValue(true);
    const { container } = render(
      <DeferredSidebarWrapper>
        <div data-testid="content">Content</div>
      </DeferredSidebarWrapper>,
    );

    expect(container.innerHTML).toBe("");
  });

  it("renders custom fallback", async () => {
    const customFallback = <div data-testid="custom-fallback">Loading...</div>;

    // We need a component that suspends
    const SuspendingComponent = React.lazy(
      () =>
        new Promise((resolve) => {
          // Never resolve to keep suspending
          setTimeout(() => resolve({ default: () => <div>Loaded</div> }), 10000);
        }),
    );

    render(
      <DeferredSidebarWrapper fallback={customFallback}>
        <SuspendingComponent />
      </DeferredSidebarWrapper>,
    );

    expect(screen.getByTestId("custom-fallback")).toBeInTheDocument();
  });

  it("renders default skeleton fallback when no custom fallback provided", async () => {
    // We need a component that suspends
    const SuspendingComponent = React.lazy(
      () =>
        new Promise((resolve) => {
          // Never resolve to keep suspending
          setTimeout(() => resolve({ default: () => <div>Loaded</div> }), 10000);
        }),
    );

    render(
      <DeferredSidebarWrapper>
        <SuspendingComponent />
      </DeferredSidebarWrapper>,
    );

    // Check for the skeleton
    const skeleton = document.querySelector('[data-sidebar-skeleton="true"]');
    expect(skeleton).toBeInTheDocument();
  });
});

describe("preloadSidebar", () => {
  it("is a function", () => {
    expect(typeof preloadSidebar).toBe("function");
  });

  it("can be called without throwing", () => {
    expect(() => preloadSidebar()).not.toThrow();
  });
});
