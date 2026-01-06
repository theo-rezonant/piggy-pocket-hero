# Snake Game - Restart Functionality Documentation

## Overview
This document describes the implementation of the 'Restart Game' functionality for the Snake game, completed as part of the game development task.

## Implementation Summary

### 1. Core Game Component
**File:** `src/pages/SnakeGame.tsx`

The Snake game is implemented as a fully functional React component with the following features:
- Classic snake gameplay on a 20x20 grid
- Real-time rendering using HTML5 Canvas
- Keyboard controls (Arrow keys and WASD)
- Score tracking
- Game state management (PLAYING, GAME_OVER)
- Pause/Resume functionality

### 2. Restart Functionality
The `resetGame()` function implements all acceptance criteria:

```typescript
const resetGame = useCallback(() => {
  // Reset snake to initial position, length, and direction
  setSnake(INITIAL_SNAKE);
  setDirection(INITIAL_DIRECTION);
  lastDirectionRef.current = INITIAL_DIRECTION;

  // Reset score to 0
  setScore(0);

  // Generate new food at random location
  setFood(generateFood(INITIAL_SNAKE));

  // Transition from GAME_OVER to PLAYING state
  setGameState(GameState.PLAYING);
  setIsPaused(false);
}, [generateFood]);
```

#### Acceptance Criteria Met:
✅ Clicking the 'Restart' button triggers the game reset function
✅ Snake returns to starting position, length, and direction
✅ Player's score is reset to 0
✅ New food is spawned at a random location
✅ 'Game Over' screen is removed and game board is displayed
✅ Game state transitions from GAME_OVER to PLAYING
✅ Game loop resumes automatically

### 3. Game Over Screen
When the game ends (by collision with wall or self):
- A semi-transparent overlay appears over the game canvas
- Displays "Game Over!" message
- Shows final score
- Presents a prominent "Restart Game" button
- Button click triggers the `resetGame()` function

### 4. Game State Management
The game uses React hooks for state management:
- `gameState`: Tracks PLAYING or GAME_OVER states
- `snake`: Array of positions representing the snake's body
- `direction`: Current movement direction
- `food`: Position of the food item
- `score`: Current player score
- `isPaused`: Pause state

### 5. Integration
**File:** `src/App.tsx`

The Snake game is integrated as a new route:
```typescript
<Route path="/snake-game" element={<SnakeGame />} />
```

Access the game at: `/snake-game`

## Testing

### Test Files
1. **Unit Tests:** `src/pages/__tests__/SnakeGame.unit.test.tsx`
   - Basic component rendering
   - Initial state verification
   - Canvas rendering
   - Keyboard controls

2. **Integration Tests:** `src/pages/__tests__/SnakeGame.test.tsx`
   - Game over scenario
   - Restart button presence
   - State reset verification
   - Game resume after restart
   - Pause functionality

### Test Results
- **15 tests** implemented
- **All tests passing** ✅
- Coverage includes:
  - Component rendering
  - Initial game state
  - Game over detection
  - Restart functionality
  - State management
  - User interactions

### Running Tests
```bash
npm test              # Run tests in watch mode
npm run test:run      # Run tests once
npm run test:ui       # Run tests with UI
```

## Game Controls

| Key | Action |
|-----|--------|
| Arrow Up / W | Move Up |
| Arrow Down / S | Move Down |
| Arrow Left / A | Move Left |
| Arrow Right / D | Move Right |
| Space | Pause/Resume |

## Technical Details

### Dependencies Added
- `vitest`: Testing framework
- `@testing-library/react`: React component testing
- `@testing-library/jest-dom`: DOM matchers
- `@testing-library/user-event`: User interaction simulation
- `jsdom`: DOM environment for testing
- `@vitest/ui`: Test UI

### Configuration Files
- `vitest.config.ts`: Vitest configuration
- `src/test/setup.ts`: Test environment setup

### Code Quality
- All new code passes ESLint validation
- TypeScript strict mode compliance
- No console errors or warnings
- Clean, well-commented code
- Proper React hooks usage

## Architecture Decisions

1. **State Management**: Used React hooks (useState, useCallback, useRef) for simplicity and performance
2. **Game Loop**: Implemented using setInterval with cleanup on unmount
3. **Rendering**: HTML5 Canvas for efficient 2D rendering
4. **Input Handling**: Global keyboard event listeners with proper cleanup
5. **Test Strategy**: Combination of unit and integration tests for comprehensive coverage

## Future Enhancements (Not in Scope)
- High score persistence
- Difficulty levels
- Sound effects
- Multiple game modes
- Mobile touch controls
- Leaderboard

## Files Modified/Created

### Created
- `src/pages/SnakeGame.tsx` - Main game component
- `src/pages/__tests__/SnakeGame.test.tsx` - Integration tests
- `src/pages/__tests__/SnakeGame.unit.test.tsx` - Unit tests
- `vitest.config.ts` - Test configuration
- `src/test/setup.ts` - Test setup
- `SNAKE_GAME_RESTART_FEATURE.md` - This documentation

### Modified
- `src/App.tsx` - Added game route
- `package.json` - Added test scripts and dependencies

## Conclusion

The restart functionality has been fully implemented according to all acceptance criteria. The game provides a smooth user experience with immediate restart capability, comprehensive testing, and clean code architecture.
