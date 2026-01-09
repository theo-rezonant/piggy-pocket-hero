import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { render, waitFor } from "@testing-library/react";
import { MemoryRouter, Routes, Route, useNavigate } from "react-router-dom";
import { useFocusOnRouteChange } from "./use-focus-on-route-change";

// Component that uses the hook
const FocusManager = () => {
  useFocusOnRouteChange();
  return null;
};

// Test page component
const TestPage = ({ title }: { title: string }) => (
  <main id="main-content">
    <h1>{title}</h1>
    <p>Test content</p>
  </main>
);

// Navigation helper component
const NavigationHelper = ({ to }: { to: string }) => {
  const navigate = useNavigate();
  return (
    <button onClick={() => navigate(to)} data-testid="navigate-button">
      Navigate
    </button>
  );
};

describe("useFocusOnRouteChange", () => {
  beforeEach(() => {
    vi.useFakeTimers({ shouldAdvanceTime: true });
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it("focuses the main content element on route change", async () => {
    const focusSpy = vi.spyOn(HTMLElement.prototype, "focus");

    render(
      <MemoryRouter initialEntries={["/"]}>
        <FocusManager />
        <Routes>
          <Route path="/" element={<TestPage title="Home" />} />
          <Route path="/about" element={<TestPage title="About" />} />
        </Routes>
        <NavigationHelper to="/about" />
      </MemoryRouter>
    );

    // Wait for initial focus
    await vi.advanceTimersByTimeAsync(150);

    expect(focusSpy).toHaveBeenCalled();
    focusSpy.mockRestore();
  });

  it("adds tabindex=-1 to main content element if not present", async () => {
    render(
      <MemoryRouter initialEntries={["/"]}>
        <FocusManager />
        <Routes>
          <Route path="/" element={<TestPage title="Home" />} />
        </Routes>
      </MemoryRouter>
    );

    await vi.advanceTimersByTimeAsync(150);

    const mainContent = document.getElementById("main-content");
    expect(mainContent).toHaveAttribute("tabindex", "-1");
  });

  it("falls back to h1 element when main-content is not present", async () => {
    const focusSpy = vi.spyOn(HTMLElement.prototype, "focus");

    render(
      <MemoryRouter initialEntries={["/"]}>
        <FocusManager />
        <Routes>
          <Route
            path="/"
            element={
              <div>
                <h1>Fallback heading</h1>
              </div>
            }
          />
        </Routes>
      </MemoryRouter>
    );

    await vi.advanceTimersByTimeAsync(150);

    const h1 = document.querySelector("h1");
    expect(h1).toHaveAttribute("tabindex", "-1");
    expect(focusSpy).toHaveBeenCalled();
    focusSpy.mockRestore();
  });

  it("cleans up timeout on unmount", async () => {
    const clearTimeoutSpy = vi.spyOn(global, "clearTimeout");

    const { unmount } = render(
      <MemoryRouter initialEntries={["/"]}>
        <FocusManager />
        <Routes>
          <Route path="/" element={<TestPage title="Home" />} />
        </Routes>
      </MemoryRouter>
    );

    unmount();

    expect(clearTimeoutSpy).toHaveBeenCalled();
    clearTimeoutSpy.mockRestore();
  });
});
