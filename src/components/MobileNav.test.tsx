import { describe, it, expect } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MobileNav } from "./MobileNav";

describe("MobileNav", () => {
  it("renders the menu trigger button with accessible label", () => {
    render(<MobileNav />);

    const menuButton = screen.getByRole("button", {
      name: /open navigation menu/i,
    });
    expect(menuButton).toBeInTheDocument();
  });

  it("opens the mobile navigation menu when trigger is clicked", async () => {
    const user = userEvent.setup();
    render(<MobileNav />);

    const menuButton = screen.getByRole("button", {
      name: /open navigation menu/i,
    });
    await user.click(menuButton);

    // Check for dialog content
    await waitFor(() => {
      expect(screen.getByRole("dialog")).toBeInTheDocument();
    });

    // Check that navigation links are visible
    expect(screen.getByRole("link", { name: /features/i })).toBeInTheDocument();
    expect(screen.getByRole("link", { name: /pricing/i })).toBeInTheDocument();
    expect(screen.getByRole("link", { name: /about/i })).toBeInTheDocument();
    expect(screen.getByRole("link", { name: /details/i })).toBeInTheDocument();
  });

  it("has accessible navigation landmark when open", async () => {
    const user = userEvent.setup();
    render(<MobileNav />);

    const menuButton = screen.getByRole("button", {
      name: /open navigation menu/i,
    });
    await user.click(menuButton);

    await waitFor(() => {
      const nav = screen.getByRole("navigation", { name: /mobile navigation/i });
      expect(nav).toBeInTheDocument();
    });
  });

  it("closes menu when close button is clicked", async () => {
    const user = userEvent.setup();
    render(<MobileNav />);

    // Open the menu
    const menuButton = screen.getByRole("button", {
      name: /open navigation menu/i,
    });
    await user.click(menuButton);

    await waitFor(() => {
      expect(screen.getByRole("dialog")).toBeInTheDocument();
    });

    // Close the menu
    const closeButton = screen.getByRole("button", { name: /close/i });
    await user.click(closeButton);

    await waitFor(() => {
      expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
    });
  });

  it("contains the Get Started button", async () => {
    const user = userEvent.setup();
    render(<MobileNav />);

    const menuButton = screen.getByRole("button", {
      name: /open navigation menu/i,
    });
    await user.click(menuButton);

    await waitFor(() => {
      expect(
        screen.getByRole("button", { name: /get started/i })
      ).toBeInTheDocument();
    });
  });

  it("is hidden on md screens and above via CSS class", () => {
    render(<MobileNav />);

    const menuButton = screen.getByRole("button", {
      name: /open navigation menu/i,
    });
    expect(menuButton).toHaveClass("md:hidden");
  });
});
