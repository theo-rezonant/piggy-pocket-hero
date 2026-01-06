# Snake Game Implementation

## Overview
A 2D Snake game implementation with automatic movement on a fixed-size game board.

## How to Play
1. Navigate to `/game` in the application
2. The snake starts moving automatically to the right
3. Use arrow keys to control direction (UP, DOWN, LEFT, RIGHT)
4. The game ends when the snake hits the wall or collides with itself
5. Click "Reset Game" to start over

## Game Features
✅ 20x20 game board
✅ Visual grid with distinct colors
✅ Snake with 3 initial segments
✅ Automatic movement at constant speed (200ms per frame)
✅ Collision detection (walls and self)
✅ Direction controls via arrow keys
✅ Game over state with reset functionality

## Technical Implementation

### Game Constants (`src/constants/game.ts`)
- `BOARD_SIZE`: 20x20 grid
- `CELL_SIZE`: 25 pixels per cell
- `SNAKE_SPEED`: 200ms per frame
- Initial snake configuration

### Core Components

#### GameBoard (`src/components/game/GameBoard.tsx`)
- Renders the game board as a grid
- Displays snake segments with different colors for head and body
- Uses Tailwind CSS for styling

#### SnakeGame (`src/components/game/SnakeGame.tsx`)
- Main game component with game loop
- Manages game state (snake position, direction, game over)
- Handles keyboard input
- Implements automatic movement using `setInterval`

### Game Logic (`src/utils/snakeLogic.ts`)
Utility functions for snake behavior:
- `getNextPosition`: Calculate next position based on direction
- `isOutOfBounds`: Check wall collisions
- `checkSelfCollision`: Detect self-collision
- `moveSnake`: Update snake position
- `initializeSnake`: Create initial snake state

### Types (`src/types/snake.ts`)
TypeScript interfaces for:
- Direction (UP, DOWN, LEFT, RIGHT)
- Position (x, y coordinates)
- GameState

## Testing
Comprehensive test suite for snake logic utilities:
```bash
npm run test
```

All 15 tests pass, covering:
- Movement in all directions
- Boundary detection
- Collision detection
- Snake initialization
- State management

## Route
Access the game at: `/game`

## Future Enhancements (Not in this ticket)
- Food spawning and collection
- Score tracking
- Speed increase as snake grows
- High score persistence
- Sound effects
- Mobile touch controls
