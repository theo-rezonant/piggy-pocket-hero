import { describe, it, expect } from "vitest";
import { checkWallCollision, checkSelfCollision } from "./useSnakeGame";
import { Position } from "@/types/snake";

describe("Snake Game Collision Detection", () => {
  describe("checkWallCollision", () => {
    const boardWidth = 20;
    const boardHeight = 20;

    it("should detect collision with left wall (x < 0)", () => {
      const head: Position = { x: -1, y: 10 };
      expect(checkWallCollision(head, boardWidth, boardHeight)).toBe(true);
    });

    it("should detect collision with right wall (x >= boardWidth)", () => {
      const head: Position = { x: 20, y: 10 };
      expect(checkWallCollision(head, boardWidth, boardHeight)).toBe(true);
    });

    it("should detect collision with top wall (y < 0)", () => {
      const head: Position = { x: 10, y: -1 };
      expect(checkWallCollision(head, boardWidth, boardHeight)).toBe(true);
    });

    it("should detect collision with bottom wall (y >= boardHeight)", () => {
      const head: Position = { x: 10, y: 20 };
      expect(checkWallCollision(head, boardWidth, boardHeight)).toBe(true);
    });

    it("should not detect collision when head is at top-left corner (0,0)", () => {
      const head: Position = { x: 0, y: 0 };
      expect(checkWallCollision(head, boardWidth, boardHeight)).toBe(false);
    });

    it("should not detect collision when head is at bottom-right corner (19,19)", () => {
      const head: Position = { x: 19, y: 19 };
      expect(checkWallCollision(head, boardWidth, boardHeight)).toBe(false);
    });

    it("should not detect collision when head is in the middle of the board", () => {
      const head: Position = { x: 10, y: 10 };
      expect(checkWallCollision(head, boardWidth, boardHeight)).toBe(false);
    });

    it("should handle different board sizes", () => {
      const head: Position = { x: 15, y: 15 };
      expect(checkWallCollision(head, 10, 10)).toBe(true);
      expect(checkWallCollision(head, 20, 20)).toBe(false);
    });
  });

  describe("checkSelfCollision", () => {
    it("should detect collision when head matches a body segment", () => {
      const snake: Position[] = [
        { x: 5, y: 5 }, // head
        { x: 5, y: 6 },
        { x: 5, y: 7 },
        { x: 6, y: 7 },
        { x: 7, y: 7 },
        { x: 7, y: 6 },
        { x: 7, y: 5 },
        { x: 6, y: 5 },
        { x: 5, y: 5 }, // body segment matching head position
      ];
      expect(checkSelfCollision(snake)).toBe(true);
    });

    it("should not detect collision when head does not match any body segment", () => {
      const snake: Position[] = [
        { x: 5, y: 5 }, // head
        { x: 5, y: 6 },
        { x: 5, y: 7 },
        { x: 6, y: 7 },
      ];
      expect(checkSelfCollision(snake)).toBe(false);
    });

    it("should not detect collision with a snake of length 1 (head only)", () => {
      const snake: Position[] = [{ x: 5, y: 5 }];
      expect(checkSelfCollision(snake)).toBe(false);
    });

    it("should not detect collision with a snake of length 2", () => {
      const snake: Position[] = [
        { x: 5, y: 5 },
        { x: 5, y: 6 },
      ];
      expect(checkSelfCollision(snake)).toBe(false);
    });

    it("should detect collision when snake forms a loop", () => {
      const snake: Position[] = [
        { x: 10, y: 10 }, // head
        { x: 10, y: 11 },
        { x: 11, y: 11 },
        { x: 11, y: 10 },
        { x: 10, y: 10 }, // collision here
      ];
      expect(checkSelfCollision(snake)).toBe(true);
    });

    it("should handle long snake without collision", () => {
      const snake: Position[] = [
        { x: 0, y: 0 }, // head
        { x: 0, y: 1 },
        { x: 0, y: 2 },
        { x: 0, y: 3 },
        { x: 0, y: 4 },
        { x: 0, y: 5 },
        { x: 0, y: 6 },
        { x: 0, y: 7 },
        { x: 0, y: 8 },
        { x: 0, y: 9 },
      ];
      expect(checkSelfCollision(snake)).toBe(false);
    });

    it("should detect collision at second body segment", () => {
      const snake: Position[] = [
        { x: 5, y: 5 }, // head
        { x: 5, y: 6 },
        { x: 5, y: 5 }, // collision with head
      ];
      expect(checkSelfCollision(snake)).toBe(true);
    });

    it("should detect collision at last body segment", () => {
      const snake: Position[] = [
        { x: 5, y: 5 }, // head
        { x: 5, y: 6 },
        { x: 5, y: 7 },
        { x: 5, y: 8 },
        { x: 5, y: 5 }, // collision at tail
      ];
      expect(checkSelfCollision(snake)).toBe(true);
    });
  });

  describe("Combined collision scenarios", () => {
    it("should handle case where snake is near wall but no collision", () => {
      const head: Position = { x: 0, y: 5 };
      expect(checkWallCollision(head, 20, 20)).toBe(false);
    });

    it("should handle edge case with minimum board size", () => {
      const head: Position = { x: 1, y: 1 };
      expect(checkWallCollision(head, 1, 1)).toBe(true);
    });

    it("should handle negative coordinates far from origin", () => {
      const head: Position = { x: -10, y: -10 };
      expect(checkWallCollision(head, 20, 20)).toBe(true);
    });

    it("should handle coordinates far beyond board", () => {
      const head: Position = { x: 100, y: 100 };
      expect(checkWallCollision(head, 20, 20)).toBe(true);
    });
  });
});
