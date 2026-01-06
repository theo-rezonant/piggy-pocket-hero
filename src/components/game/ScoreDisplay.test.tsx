import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { ScoreDisplay } from "./ScoreDisplay";

describe("ScoreDisplay", () => {
  it("renders the score label", () => {
    render(<ScoreDisplay score={0} />);
    expect(screen.getByText("Score:")).toBeInTheDocument();
  });

  it("displays score starting at 0", () => {
    render(<ScoreDisplay score={0} />);
    expect(screen.getByText("0")).toBeInTheDocument();
  });

  it("displays the current score value", () => {
    render(<ScoreDisplay score={42} />);
    expect(screen.getByText("42")).toBeInTheDocument();
  });

  it("updates when score changes", () => {
    const { rerender } = render(<ScoreDisplay score={0} />);
    expect(screen.getByText("0")).toBeInTheDocument();

    rerender(<ScoreDisplay score={5} />);
    expect(screen.getByText("5")).toBeInTheDocument();
  });

  it("displays large scores correctly", () => {
    render(<ScoreDisplay score={9999} />);
    expect(screen.getByText("9999")).toBeInTheDocument();
  });
});
