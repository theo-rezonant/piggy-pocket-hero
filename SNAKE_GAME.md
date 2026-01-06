# Snake Game - User Controls Documentation

## Overview
This implementation adds user controls to change the snake's direction of movement using keyboard inputs.

## How to Play
1. Navigate to `/snake` route in the application
2. Use arrow keys to control the snake's movement:
   - **↑ (ArrowUp)**: Move Up
   - **↓ (ArrowDown)**: Move Down
   - **← (ArrowLeft)**: Move Left
   - **→ (ArrowRight)**: Move Right

## Features Implemented

### 1. Keyboard Input Detection
- Event listener captures `keydown` events for arrow keys
- Prevents default browser scrolling behavior when arrow keys are pressed

### 2. Direction Reversal Prevention
- Snake cannot immediately reverse its direction
- If moving RIGHT, pressing LEFT has no effect
- If moving UP, pressing DOWN has no effect
- This prevents the snake from colliding with itself instantly

### 3. Direction Queue System
- Direction changes are queued using `nextDirection` state
- Changes are applied at the start of the next game tick
- Ensures smooth, consistent movement and prevents invalid moves within a single frame

### 4. Constant Speed Movement
- Game runs at 150ms per tick
- Snake maintains consistent speed regardless of direction changes
- Movement is frame-independent

## Technical Implementation

### State Management
```typescript
const [direction, setDirection] = useState<Direction>('RIGHT');
const [nextDirection, setNextDirection] = useState<Direction>('RIGHT');
```

### Direction Validation
```typescript
const isValidDirectionChange = (current: Direction, next: Direction): boolean => {
  const opposites: Record<Direction, Direction> = {
    UP: 'DOWN',
    DOWN: 'UP',
    LEFT: 'RIGHT',
    RIGHT: 'LEFT'
  };
  return opposites[current] !== next;
};
```

### Game Loop Integration
- Direction is applied at the start of each game tick
- Ensures no invalid moves occur within a single frame
- Provides responsive and accurate control input handling

## Testing
- Code passes ESLint with no errors
- Successfully builds for production
- Manual testing can be done by:
  1. Running `npm run dev`
  2. Navigating to `/snake`
  3. Testing all arrow key inputs
  4. Verifying direction reversal prevention works correctly
