import { describe, it, expect } from 'vitest';
import {
  getNextPosition,
  isOutOfBounds,
  checkSelfCollision,
  moveSnake,
  initializeSnake,
} from '../snakeLogic';
import { Position, Direction } from '@/types/snake';

describe('snakeLogic', () => {
  describe('getNextPosition', () => {
    it('should move UP correctly', () => {
      const position: Position = { x: 5, y: 5 };
      const result = getNextPosition(position, 'UP');
      expect(result).toEqual({ x: 5, y: 4 });
    });

    it('should move DOWN correctly', () => {
      const position: Position = { x: 5, y: 5 };
      const result = getNextPosition(position, 'DOWN');
      expect(result).toEqual({ x: 5, y: 6 });
    });

    it('should move LEFT correctly', () => {
      const position: Position = { x: 5, y: 5 };
      const result = getNextPosition(position, 'LEFT');
      expect(result).toEqual({ x: 4, y: 5 });
    });

    it('should move RIGHT correctly', () => {
      const position: Position = { x: 5, y: 5 };
      const result = getNextPosition(position, 'RIGHT');
      expect(result).toEqual({ x: 6, y: 5 });
    });
  });

  describe('isOutOfBounds', () => {
    it('should return true for negative x', () => {
      expect(isOutOfBounds({ x: -1, y: 5 })).toBe(true);
    });

    it('should return true for negative y', () => {
      expect(isOutOfBounds({ x: 5, y: -1 })).toBe(true);
    });

    it('should return true for x >= BOARD_SIZE', () => {
      expect(isOutOfBounds({ x: 20, y: 5 })).toBe(true);
    });

    it('should return true for y >= BOARD_SIZE', () => {
      expect(isOutOfBounds({ x: 5, y: 20 })).toBe(true);
    });

    it('should return false for valid position', () => {
      expect(isOutOfBounds({ x: 10, y: 10 })).toBe(false);
    });
  });

  describe('checkSelfCollision', () => {
    it('should return true when head collides with body', () => {
      const head: Position = { x: 5, y: 5 };
      const body: Position[] = [
        { x: 6, y: 5 },
        { x: 5, y: 5 },
        { x: 4, y: 5 },
      ];
      expect(checkSelfCollision(head, body)).toBe(true);
    });

    it('should return false when no collision', () => {
      const head: Position = { x: 5, y: 5 };
      const body: Position[] = [
        { x: 6, y: 5 },
        { x: 7, y: 5 },
        { x: 8, y: 5 },
      ];
      expect(checkSelfCollision(head, body)).toBe(false);
    });
  });

  describe('moveSnake', () => {
    it('should move snake in the given direction', () => {
      const snake: Position[] = [
        { x: 5, y: 5 },
        { x: 4, y: 5 },
        { x: 3, y: 5 },
      ];
      const result = moveSnake(snake, 'RIGHT');
      expect(result).toEqual([
        { x: 6, y: 5 },
        { x: 5, y: 5 },
        { x: 4, y: 5 },
      ]);
    });

    it('should maintain snake length', () => {
      const snake: Position[] = [
        { x: 5, y: 5 },
        { x: 4, y: 5 },
        { x: 3, y: 5 },
      ];
      const result = moveSnake(snake, 'UP');
      expect(result.length).toBe(snake.length);
    });
  });

  describe('initializeSnake', () => {
    it('should create snake with correct length', () => {
      const snake = initializeSnake(10, 10, 3);
      expect(snake.length).toBe(3);
    });

    it('should create snake at correct position', () => {
      const snake = initializeSnake(10, 10, 3);
      expect(snake[0]).toEqual({ x: 10, y: 10 });
      expect(snake[1]).toEqual({ x: 9, y: 10 });
      expect(snake[2]).toEqual({ x: 8, y: 10 });
    });
  });
});
