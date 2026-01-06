// Game board configuration
export const BOARD_SIZE = 20;
export const CELL_SIZE = 25; // Size in pixels

// Game speed (milliseconds per frame)
export const SNAKE_SPEED = 200;

// Initial snake configuration
export const INITIAL_SNAKE_LENGTH = 3;
export const INITIAL_DIRECTION = 'RIGHT' as const;
export const INITIAL_SNAKE_POSITION = { x: 10, y: 10 };

// Colors
export const COLORS = {
  board: '#1a1a2e',
  snake: '#4ade80',
  snakeHead: '#22c55e',
  grid: '#2d2d44',
} as const;
