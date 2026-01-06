import { useState, useEffect, useCallback, useRef, useMemo } from "react";
import { GameState, Direction, Position, GameConfig } from "@/types/snake";

const DEFAULT_CONFIG: GameConfig = {
  boardWidth: 20,
  boardHeight: 20,
  cellSize: 20,
  initialSnakeLength: 3,
  gameSpeed: 150,
};

/**
 * Check if the snake's head collides with the walls
 * Wall collision occurs when head coordinates are out of bounds
 */
const checkWallCollision = (
  head: Position,
  boardWidth: number,
  boardHeight: number
): boolean => {
  return (
    head.x < 0 ||
    head.x >= boardWidth ||
    head.y < 0 ||
    head.y >= boardHeight
  );
};

/**
 * Check if the snake's head collides with its own body
 * Self-collision occurs when head coordinates match any body segment
 */
const checkSelfCollision = (snake: Position[]): boolean => {
  if (snake.length < 2) return false;

  const head = snake[0];
  // Check if head matches any body segment (excluding the head itself)
  for (let i = 1; i < snake.length; i++) {
    if (head.x === snake[i].x && head.y === snake[i].y) {
      return true;
    }
  }
  return false;
};

/**
 * Generate random food position that doesn't overlap with snake
 */
const generateFood = (snake: Position[], boardWidth: number, boardHeight: number): Position => {
  let food: Position;
  let isOnSnake: boolean;

  do {
    food = {
      x: Math.floor(Math.random() * boardWidth),
      y: Math.floor(Math.random() * boardHeight),
    };
    isOnSnake = snake.some(segment => segment.x === food.x && segment.y === food.y);
  } while (isOnSnake);

  return food;
};

/**
 * Initialize game state with default values
 */
const initializeGame = (config: GameConfig): GameState => {
  const centerX = Math.floor(config.boardWidth / 2);
  const centerY = Math.floor(config.boardHeight / 2);

  const snake: Position[] = [];
  for (let i = 0; i < config.initialSnakeLength; i++) {
    snake.push({ x: centerX - i, y: centerY });
  }

  return {
    snake,
    direction: Direction.RIGHT,
    food: generateFood(snake, config.boardWidth, config.boardHeight),
    score: 0,
    isGameOver: false,
    isPaused: false,
  };
};

export const useSnakeGame = (customConfig?: Partial<GameConfig>) => {
  const config = useMemo(() => ({ ...DEFAULT_CONFIG, ...customConfig }), [customConfig]);
  const [gameState, setGameState] = useState<GameState>(() => initializeGame(config));
  const gameLoopRef = useRef<NodeJS.Timeout | null>(null);

  /**
   * Move the snake in the current direction
   */
  const moveSnake = useCallback(() => {
    setGameState((prevState) => {
      // Don't move if game is over or paused
      if (prevState.isGameOver || prevState.isPaused) {
        return prevState;
      }

      const snake = [...prevState.snake];
      const head = { ...snake[0] };

      // Calculate new head position based on direction
      switch (prevState.direction) {
        case Direction.UP:
          head.y -= 1;
          break;
        case Direction.DOWN:
          head.y += 1;
          break;
        case Direction.LEFT:
          head.x -= 1;
          break;
        case Direction.RIGHT:
          head.x += 1;
          break;
      }

      // Check for wall collision
      if (checkWallCollision(head, config.boardWidth, config.boardHeight)) {
        return {
          ...prevState,
          isGameOver: true,
        };
      }

      // Add new head
      snake.unshift(head);

      // Check if snake ate food
      const ateFood = head.x === prevState.food.x && head.y === prevState.food.y;

      if (ateFood) {
        // Don't remove tail (snake grows)
        return {
          ...prevState,
          snake,
          food: generateFood(snake, config.boardWidth, config.boardHeight),
          score: prevState.score + 10,
        };
      } else {
        // Remove tail (snake maintains size)
        snake.pop();
      }

      // Check for self-collision (after moving)
      if (checkSelfCollision(snake)) {
        return {
          ...prevState,
          snake,
          isGameOver: true,
        };
      }

      return {
        ...prevState,
        snake,
      };
    });
  }, [config.boardWidth, config.boardHeight]);

  /**
   * Change snake direction (prevent 180-degree turns)
   */
  const changeDirection = useCallback((newDirection: Direction) => {
    setGameState((prevState) => {
      // Don't allow direction change if game is over
      if (prevState.isGameOver) return prevState;

      // Prevent 180-degree turns
      const opposites: Record<Direction, Direction> = {
        [Direction.UP]: Direction.DOWN,
        [Direction.DOWN]: Direction.UP,
        [Direction.LEFT]: Direction.RIGHT,
        [Direction.RIGHT]: Direction.LEFT,
      };

      if (opposites[prevState.direction] === newDirection) {
        return prevState;
      }

      return {
        ...prevState,
        direction: newDirection,
      };
    });
  }, []);

  /**
   * Reset game to initial state
   */
  const resetGame = useCallback(() => {
    setGameState(initializeGame(config));
  }, [config]);

  /**
   * Toggle pause state
   */
  const togglePause = useCallback(() => {
    setGameState((prevState) => ({
      ...prevState,
      isPaused: !prevState.isPaused,
    }));
  }, []);

  /**
   * Game loop - runs on interval
   */
  useEffect(() => {
    // Clear existing interval
    if (gameLoopRef.current) {
      clearInterval(gameLoopRef.current);
    }

    // Don't start loop if game is over or paused
    if (gameState.isGameOver || gameState.isPaused) {
      return;
    }

    // Start game loop
    gameLoopRef.current = setInterval(() => {
      moveSnake();
    }, config.gameSpeed);

    // Cleanup on unmount
    return () => {
      if (gameLoopRef.current) {
        clearInterval(gameLoopRef.current);
      }
    };
  }, [gameState.isGameOver, gameState.isPaused, config.gameSpeed, moveSnake]);

  return {
    gameState,
    changeDirection,
    resetGame,
    togglePause,
    config,
  };
};

// Export collision detection functions for testing
export { checkWallCollision, checkSelfCollision };
