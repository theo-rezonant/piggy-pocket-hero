import { Position, Direction } from '@/types/snake';
import { BOARD_SIZE } from '@/constants/game';

/**
 * Calculate the next position based on current position and direction
 */
export const getNextPosition = (head: Position, direction: Direction): Position => {
  const newHead = { ...head };

  switch (direction) {
    case 'UP':
      newHead.y -= 1;
      break;
    case 'DOWN':
      newHead.y += 1;
      break;
    case 'LEFT':
      newHead.x -= 1;
      break;
    case 'RIGHT':
      newHead.x += 1;
      break;
  }

  return newHead;
};

/**
 * Check if position is out of bounds
 */
export const isOutOfBounds = (position: Position): boolean => {
  return (
    position.x < 0 ||
    position.x >= BOARD_SIZE ||
    position.y < 0 ||
    position.y >= BOARD_SIZE
  );
};

/**
 * Check if snake collides with itself
 */
export const checkSelfCollision = (head: Position, body: Position[]): boolean => {
  return body.some(segment => segment.x === head.x && segment.y === head.y);
};

/**
 * Move the snake in the current direction
 */
export const moveSnake = (snake: Position[], direction: Direction): Position[] => {
  const head = snake[0];
  const newHead = getNextPosition(head, direction);

  // Create new snake by adding new head and removing tail
  const newSnake = [newHead, ...snake.slice(0, -1)];

  return newSnake;
};

/**
 * Initialize snake at starting position
 */
export const initializeSnake = (startX: number, startY: number, length: number): Position[] => {
  const snake: Position[] = [];

  // Create snake moving right
  for (let i = 0; i < length; i++) {
    snake.push({
      x: startX - i,
      y: startY,
    });
  }

  return snake;
};
