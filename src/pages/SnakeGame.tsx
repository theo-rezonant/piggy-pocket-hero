import { useEffect, useRef, useState, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';

// Game constants
const CANVAS_WIDTH = 600;
const CANVAS_HEIGHT = 600;
const GRID_SIZE = 20;
const INITIAL_SNAKE = [{ x: 10, y: 10 }];
const INITIAL_DIRECTION = { x: 1, y: 0 };
const GAME_SPEED = 100; // milliseconds

// Game states
enum GameState {
  PLAYING = 'PLAYING',
  GAME_OVER = 'GAME_OVER',
}

interface Position {
  x: number;
  y: number;
}

const SnakeGame = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [snake, setSnake] = useState<Position[]>(INITIAL_SNAKE);
  const [direction, setDirection] = useState<Position>(INITIAL_DIRECTION);
  const [food, setFood] = useState<Position>({ x: 15, y: 15 });
  const [score, setScore] = useState(0);
  const [gameState, setGameState] = useState<GameState>(GameState.PLAYING);
  const gameLoopRef = useRef<NodeJS.Timeout | null>(null);
  const directionQueueRef = useRef<Position>(INITIAL_DIRECTION);

  // Generate random food position
  const generateFood = useCallback(
    (currentSnake: Position[]): Position => {
      let newFood: Position;
      do {
        newFood = {
          x: Math.floor(Math.random() * (CANVAS_WIDTH / GRID_SIZE)),
          y: Math.floor(Math.random() * (CANVAS_HEIGHT / GRID_SIZE)),
        };
      } while (
        currentSnake.some((segment) => segment.x === newFood.x && segment.y === newFood.y)
      );
      return newFood;
    },
    []
  );

  // Collision detection (DRAFT-004)
  const checkCollision = useCallback((head: Position, snakeBody: Position[]): boolean => {
    // Check wall collision
    if (
      head.x < 0 ||
      head.x >= CANVAS_WIDTH / GRID_SIZE ||
      head.y < 0 ||
      head.y >= CANVAS_HEIGHT / GRID_SIZE
    ) {
      return true;
    }

    // Check self collision (skip the head itself)
    return snakeBody.slice(1).some((segment) => segment.x === head.x && segment.y === head.y);
  }, []);

  // Game loop
  const gameLoop = useCallback(() => {
    setSnake((prevSnake) => {
      const newHead = {
        x: prevSnake[0].x + directionQueueRef.current.x,
        y: prevSnake[0].y + directionQueueRef.current.y,
      };

      // Check for collisions
      if (checkCollision(newHead, prevSnake)) {
        setGameState(GameState.GAME_OVER);
        return prevSnake;
      }

      const newSnake = [newHead, ...prevSnake];

      // Check if food is eaten
      if (newHead.x === food.x && newHead.y === food.y) {
        setScore((prevScore) => prevScore + 10); // Score tracking (DRAFT-006)
        setFood(generateFood(newSnake));
      } else {
        newSnake.pop(); // Remove tail if no food eaten
      }

      return newSnake;
    });
  }, [food, checkCollision, generateFood]);

  // Handle keyboard input
  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if (gameState !== GameState.PLAYING) return;

      const key = e.key;
      let newDirection: Position | null = null;

      switch (key) {
        case 'ArrowUp':
        case 'w':
        case 'W':
          if (directionQueueRef.current.y === 0) {
            newDirection = { x: 0, y: -1 };
          }
          break;
        case 'ArrowDown':
        case 's':
        case 'S':
          if (directionQueueRef.current.y === 0) {
            newDirection = { x: 0, y: 1 };
          }
          break;
        case 'ArrowLeft':
        case 'a':
        case 'A':
          if (directionQueueRef.current.x === 0) {
            newDirection = { x: -1, y: 0 };
          }
          break;
        case 'ArrowRight':
        case 'd':
        case 'D':
          if (directionQueueRef.current.x === 0) {
            newDirection = { x: 1, y: 0 };
          }
          break;
      }

      if (newDirection) {
        e.preventDefault();
        setDirection(newDirection);
        directionQueueRef.current = newDirection;
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [gameState]);

  // Start/stop game loop based on game state
  useEffect(() => {
    if (gameState === GameState.PLAYING) {
      gameLoopRef.current = setInterval(gameLoop, GAME_SPEED);
    } else {
      if (gameLoopRef.current) {
        clearInterval(gameLoopRef.current);
        gameLoopRef.current = null;
      }
    }

    return () => {
      if (gameLoopRef.current) {
        clearInterval(gameLoopRef.current);
      }
    };
  }, [gameState, gameLoop]);

  // Render game on canvas
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Clear canvas
    ctx.fillStyle = '#1a1a1a';
    ctx.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);

    // Draw grid
    ctx.strokeStyle = '#2a2a2a';
    ctx.lineWidth = 1;
    for (let i = 0; i <= CANVAS_WIDTH; i += GRID_SIZE) {
      ctx.beginPath();
      ctx.moveTo(i, 0);
      ctx.lineTo(i, CANVAS_HEIGHT);
      ctx.stroke();
    }
    for (let i = 0; i <= CANVAS_HEIGHT; i += GRID_SIZE) {
      ctx.beginPath();
      ctx.moveTo(0, i);
      ctx.lineTo(CANVAS_WIDTH, i);
      ctx.stroke();
    }

    // Draw snake
    snake.forEach((segment, index) => {
      ctx.fillStyle = index === 0 ? '#4ade80' : '#22c55e';
      ctx.fillRect(
        segment.x * GRID_SIZE + 1,
        segment.y * GRID_SIZE + 1,
        GRID_SIZE - 2,
        GRID_SIZE - 2
      );
    });

    // Draw food
    ctx.fillStyle = '#ef4444';
    ctx.beginPath();
    ctx.arc(
      food.x * GRID_SIZE + GRID_SIZE / 2,
      food.y * GRID_SIZE + GRID_SIZE / 2,
      GRID_SIZE / 2 - 2,
      0,
      Math.PI * 2
    );
    ctx.fill();
  }, [snake, food]);

  // Restart game
  const restartGame = () => {
    setSnake(INITIAL_SNAKE);
    setDirection(INITIAL_DIRECTION);
    directionQueueRef.current = INITIAL_DIRECTION;
    setFood(generateFood(INITIAL_SNAKE));
    setScore(0);
    setGameState(GameState.PLAYING);
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="flex flex-col items-center gap-6">
        <div className="text-center">
          <h1 className="text-4xl font-bold mb-2">Snake Game</h1>
          <p className="text-muted-foreground">
            Use arrow keys or WASD to move
          </p>
        </div>

        <Card className="relative">
          <CardContent className="p-6">
            <div className="mb-4 text-center">
              <span className="text-2xl font-bold">Score: {score}</span>
            </div>

            <div className="relative inline-block">
              <canvas
                ref={canvasRef}
                width={CANVAS_WIDTH}
                height={CANVAS_HEIGHT}
                className="border-2 border-border rounded"
              />

              {/* Game Over Overlay */}
              {gameState === GameState.GAME_OVER && (
                <div className="absolute inset-0 bg-black/80 flex items-center justify-center rounded">
                  <div className="text-center space-y-6 p-8">
                    <h2 className="text-5xl font-bold text-white">Game Over</h2>
                    <div className="text-3xl font-semibold text-white">
                      Final Score: <span className="text-primary">{score}</span>
                    </div>
                    <Button
                      onClick={restartGame}
                      size="lg"
                      className="mt-4"
                    >
                      Play Again
                    </Button>
                  </div>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        <div className="text-center text-sm text-muted-foreground max-w-md">
          <p>
            Eat the red food to grow and increase your score. Avoid hitting the
            walls or yourself!
          </p>
        </div>
      </div>
    </div>
  );
};

export default SnakeGame;
