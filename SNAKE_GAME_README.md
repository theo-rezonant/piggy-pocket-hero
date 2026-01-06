# Snake Game - Game Over Conditions Implementation

## Overview
This document describes the implementation of game over conditions for the 2D snake game, specifically wall collision and self-collision detection.

## Implementation Details

### Files Created

1. **`src/types/snake.ts`** - Type definitions for the game
   - `Position`: Snake segment coordinates
   - `Direction`: Movement directions (UP, DOWN, LEFT, RIGHT)
   - `GameState`: Complete game state including `isGameOver` flag
   - `GameConfig`: Game configuration parameters

2. **`src/hooks/useSnakeGame.ts`** - Core game logic and collision detection
   - `checkWallCollision()`: Detects when snake head hits walls
   - `checkSelfCollision()`: Detects when snake head collides with body
   - `useSnakeGame()`: Custom React hook managing game state and loop

3. **`src/pages/SnakeGame.tsx`** - Game UI component
   - Renders game board and snake
   - Handles keyboard controls
   - Displays game over screen

4. **`src/hooks/useSnakeGame.test.ts`** - Comprehensive test suite
   - 20 test cases covering all collision scenarios

### Collision Detection Logic

#### Wall Collision
Checks if the snake's head is outside the game board boundaries:
```typescript
const checkWallCollision = (head: Position, boardWidth: number, boardHeight: number): boolean => {
  return (
    head.x < 0 ||
    head.x >= boardWidth ||
    head.y < 0 ||
    head.y >= boardHeight
  );
};
```

#### Self-Collision
Iterates through snake body segments (excluding head) to check for overlap:
```typescript
const checkSelfCollision = (snake: Position[]): boolean => {
  if (snake.length < 2) return false;

  const head = snake[0];
  for (let i = 1; i < snake.length; i++) {
    if (head.x === snake[i].x && head.y === snake[i].y) {
      return true;
    }
  }
  return false;
};
```

### Game State Management

The `isGameOver` flag is set to `true` when either collision occurs:
- When set, the game loop stops executing
- Snake movement ceases
- Food spawning stops
- Game over UI is displayed

## Acceptance Criteria - Completed ✓

- [x] Game transitions to "game over" state on wall collision
- [x] Game transitions to "game over" state on self-collision
- [x] Snake movement and game logic cease when game over
- [x] `isGameOver` state flag accessible to other components

## How to Access the Game

1. Start the development server: `npm run dev`
2. Navigate to: `http://localhost:8080/snake`

## Controls

- **Arrow Keys / WASD**: Move snake
- **Space**: Pause/Resume
- **R**: Restart (when game over)

## Testing

Run the test suite:
```bash
npm test
```

All 20 test cases pass, covering:
- Wall collision detection (8 tests)
- Self-collision detection (8 tests)
- Edge cases and combined scenarios (4 tests)

## Configuration

Default game settings (customizable):
- Board size: 20x20 cells
- Cell size: 20px
- Initial snake length: 3 segments
- Game speed: 150ms per tick

## Technical Notes

- Collision detection runs every frame within the main game loop
- React hooks (`useState`, `useEffect`, `useCallback`) manage game state
- TypeScript ensures type safety throughout
- All new code passes ESLint checks
