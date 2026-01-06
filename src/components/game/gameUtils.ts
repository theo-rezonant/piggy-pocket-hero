/**
 * Utility functions for the Snake game
 * These are extracted to be easily testable
 */

export interface Position {
  x: number;
  y: number;
}

/**
 * Generates a random position within the game grid
 * @param gridSize - The size of the game grid
 * @returns A random position within bounds
 */
export const generateRandomPosition = (gridSize: number): Position => {
  return {
    x: Math.floor(Math.random() * gridSize),
    y: Math.floor(Math.random() * gridSize),
  };
};

/**
 * Checks if a position is occupied by any part of the snake
 * @param position - The position to check
 * @param snake - Array of snake body segments
 * @returns true if the position is occupied by the snake
 */
export const isPositionOccupiedBySnake = (
  position: Position,
  snake: Position[]
): boolean => {
  return snake.some(
    segment => segment.x === position.x && segment.y === position.y
  );
};

/**
 * Generates a random food position that doesn't overlap with the snake
 * Will keep trying until an empty position is found
 * @param snake - Array of snake body segments
 * @param gridSize - The size of the game grid
 * @returns A valid food position not occupied by the snake
 */
export const generateFoodPosition = (
  snake: Position[],
  gridSize: number
): Position => {
  let foodPosition: Position;
  let attempts = 0;
  const maxAttempts = gridSize * gridSize; // Prevent infinite loop

  do {
    foodPosition = generateRandomPosition(gridSize);
    attempts++;
  } while (
    isPositionOccupiedBySnake(foodPosition, snake) &&
    attempts < maxAttempts
  );

  return foodPosition;
};

/**
 * Checks if two positions are equal
 * @param pos1 - First position
 * @param pos2 - Second position
 * @returns true if positions have the same x and y coordinates
 */
export const positionsEqual = (pos1: Position, pos2: Position): boolean => {
  return pos1.x === pos2.x && pos1.y === pos2.y;
};

/**
 * Checks if a position is within the game grid boundaries
 * @param position - The position to check
 * @param gridSize - The size of the game grid
 * @returns true if the position is within bounds
 */
export const isPositionInBounds = (
  position: Position,
  gridSize: number
): boolean => {
  return (
    position.x >= 0 &&
    position.x < gridSize &&
    position.y >= 0 &&
    position.y < gridSize
  );
};
