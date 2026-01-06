import { describe, it, expect, beforeEach, vi } from 'vitest';
import {
  generateRandomPosition,
  isPositionOccupiedBySnake,
  generateFoodPosition,
  positionsEqual,
  isPositionInBounds,
  type Position,
} from './gameUtils';

describe('gameUtils', () => {
  describe('generateRandomPosition', () => {
    it('should generate a position within bounds', () => {
      const gridSize = 20;
      const position = generateRandomPosition(gridSize);

      expect(position.x).toBeGreaterThanOrEqual(0);
      expect(position.x).toBeLessThan(gridSize);
      expect(position.y).toBeGreaterThanOrEqual(0);
      expect(position.y).toBeLessThan(gridSize);
    });

    it('should generate different positions over multiple calls', () => {
      const gridSize = 20;
      const positions = new Set<string>();

      // Generate 100 positions and check we get some variety
      for (let i = 0; i < 100; i++) {
        const pos = generateRandomPosition(gridSize);
        positions.add(`${pos.x},${pos.y}`);
      }

      // We should have more than one unique position
      expect(positions.size).toBeGreaterThan(1);
    });

    it('should work with small grid sizes', () => {
      const gridSize = 2;
      const position = generateRandomPosition(gridSize);

      expect(position.x).toBeGreaterThanOrEqual(0);
      expect(position.x).toBeLessThan(gridSize);
      expect(position.y).toBeGreaterThanOrEqual(0);
      expect(position.y).toBeLessThan(gridSize);
    });
  });

  describe('isPositionOccupiedBySnake', () => {
    it('should return true when position is occupied by snake head', () => {
      const snake: Position[] = [
        { x: 5, y: 5 },
        { x: 5, y: 6 },
        { x: 5, y: 7 },
      ];
      const position = { x: 5, y: 5 };

      expect(isPositionOccupiedBySnake(position, snake)).toBe(true);
    });

    it('should return true when position is occupied by snake body', () => {
      const snake: Position[] = [
        { x: 5, y: 5 },
        { x: 5, y: 6 },
        { x: 5, y: 7 },
      ];
      const position = { x: 5, y: 6 };

      expect(isPositionOccupiedBySnake(position, snake)).toBe(true);
    });

    it('should return true when position is occupied by snake tail', () => {
      const snake: Position[] = [
        { x: 5, y: 5 },
        { x: 5, y: 6 },
        { x: 5, y: 7 },
      ];
      const position = { x: 5, y: 7 };

      expect(isPositionOccupiedBySnake(position, snake)).toBe(true);
    });

    it('should return false when position is not occupied', () => {
      const snake: Position[] = [
        { x: 5, y: 5 },
        { x: 5, y: 6 },
        { x: 5, y: 7 },
      ];
      const position = { x: 10, y: 10 };

      expect(isPositionOccupiedBySnake(position, snake)).toBe(false);
    });

    it('should return false for empty snake', () => {
      const snake: Position[] = [];
      const position = { x: 5, y: 5 };

      expect(isPositionOccupiedBySnake(position, snake)).toBe(false);
    });

    it('should handle single segment snake', () => {
      const snake: Position[] = [{ x: 5, y: 5 }];

      expect(isPositionOccupiedBySnake({ x: 5, y: 5 }, snake)).toBe(true);
      expect(isPositionOccupiedBySnake({ x: 5, y: 6 }, snake)).toBe(false);
    });
  });

  describe('generateFoodPosition', () => {
    it('should generate a position not occupied by the snake', () => {
      const snake: Position[] = [
        { x: 5, y: 5 },
        { x: 5, y: 6 },
        { x: 5, y: 7 },
      ];
      const gridSize = 20;

      const foodPosition = generateFoodPosition(snake, gridSize);

      expect(isPositionOccupiedBySnake(foodPosition, snake)).toBe(false);
    });

    it('should generate a position within bounds', () => {
      const snake: Position[] = [{ x: 10, y: 10 }];
      const gridSize = 20;

      const foodPosition = generateFoodPosition(snake, gridSize);

      expect(foodPosition.x).toBeGreaterThanOrEqual(0);
      expect(foodPosition.x).toBeLessThan(gridSize);
      expect(foodPosition.y).toBeGreaterThanOrEqual(0);
      expect(foodPosition.y).toBeLessThan(gridSize);
    });

    it('should find a valid position when snake is small', () => {
      const snake: Position[] = [{ x: 0, y: 0 }];
      const gridSize = 10;

      // Run multiple times to ensure consistency
      for (let i = 0; i < 10; i++) {
        const foodPosition = generateFoodPosition(snake, gridSize);
        expect(isPositionOccupiedBySnake(foodPosition, snake)).toBe(false);
      }
    });

    it('should work with a larger snake', () => {
      const snake: Position[] = [
        { x: 5, y: 5 },
        { x: 6, y: 5 },
        { x: 7, y: 5 },
        { x: 8, y: 5 },
        { x: 9, y: 5 },
      ];
      const gridSize = 20;

      const foodPosition = generateFoodPosition(snake, gridSize);

      expect(isPositionOccupiedBySnake(foodPosition, snake)).toBe(false);
      expect(isPositionInBounds(foodPosition, gridSize)).toBe(true);
    });

    it('should find position when only one spot is available', () => {
      // Create a 2x2 grid with snake occupying 3 spots
      const snake: Position[] = [
        { x: 0, y: 0 },
        { x: 0, y: 1 },
        { x: 1, y: 0 },
      ];
      const gridSize = 2;

      // Mock Math.random to return the one free position
      const mockRandom = vi.spyOn(Math, 'random');
      mockRandom.mockReturnValueOnce(0.75); // x = 1
      mockRandom.mockReturnValueOnce(0.75); // y = 1

      const foodPosition = generateFoodPosition(snake, gridSize);

      expect(foodPosition).toEqual({ x: 1, y: 1 });
      expect(isPositionOccupiedBySnake(foodPosition, snake)).toBe(false);

      mockRandom.mockRestore();
    });
  });

  describe('positionsEqual', () => {
    it('should return true for equal positions', () => {
      const pos1 = { x: 5, y: 10 };
      const pos2 = { x: 5, y: 10 };

      expect(positionsEqual(pos1, pos2)).toBe(true);
    });

    it('should return false for different x coordinates', () => {
      const pos1 = { x: 5, y: 10 };
      const pos2 = { x: 6, y: 10 };

      expect(positionsEqual(pos1, pos2)).toBe(false);
    });

    it('should return false for different y coordinates', () => {
      const pos1 = { x: 5, y: 10 };
      const pos2 = { x: 5, y: 11 };

      expect(positionsEqual(pos1, pos2)).toBe(false);
    });

    it('should return false for completely different positions', () => {
      const pos1 = { x: 5, y: 10 };
      const pos2 = { x: 15, y: 20 };

      expect(positionsEqual(pos1, pos2)).toBe(false);
    });

    it('should work with zero coordinates', () => {
      const pos1 = { x: 0, y: 0 };
      const pos2 = { x: 0, y: 0 };

      expect(positionsEqual(pos1, pos2)).toBe(true);
    });
  });

  describe('isPositionInBounds', () => {
    it('should return true for position within bounds', () => {
      const position = { x: 10, y: 10 };
      const gridSize = 20;

      expect(isPositionInBounds(position, gridSize)).toBe(true);
    });

    it('should return true for position at origin', () => {
      const position = { x: 0, y: 0 };
      const gridSize = 20;

      expect(isPositionInBounds(position, gridSize)).toBe(true);
    });

    it('should return true for position at maximum bounds', () => {
      const position = { x: 19, y: 19 };
      const gridSize = 20;

      expect(isPositionInBounds(position, gridSize)).toBe(true);
    });

    it('should return false for negative x coordinate', () => {
      const position = { x: -1, y: 10 };
      const gridSize = 20;

      expect(isPositionInBounds(position, gridSize)).toBe(false);
    });

    it('should return false for negative y coordinate', () => {
      const position = { x: 10, y: -1 };
      const gridSize = 20;

      expect(isPositionInBounds(position, gridSize)).toBe(false);
    });

    it('should return false for x coordinate beyond bounds', () => {
      const position = { x: 20, y: 10 };
      const gridSize = 20;

      expect(isPositionInBounds(position, gridSize)).toBe(false);
    });

    it('should return false for y coordinate beyond bounds', () => {
      const position = { x: 10, y: 20 };
      const gridSize = 20;

      expect(isPositionInBounds(position, gridSize)).toBe(false);
    });

    it('should return false for both coordinates out of bounds', () => {
      const position = { x: -5, y: 25 };
      const gridSize = 20;

      expect(isPositionInBounds(position, gridSize)).toBe(false);
    });
  });
});
