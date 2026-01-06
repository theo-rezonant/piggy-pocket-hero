import { useEffect, useRef, useState, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

// Game constants
const CANVAS_SIZE = 400;
const GRID_SIZE = 20;
const CELL_SIZE = CANVAS_SIZE / GRID_SIZE;
const INITIAL_SNAKE = [{ x: 10, y: 10 }];
const INITIAL_DIRECTION = { x: 1, y: 0 };
const GAME_SPEED = 100; // milliseconds

// Game states
enum GameState {
  PLAYING = "PLAYING",
  GAME_OVER = "GAME_OVER",
}

// Types
interface Position {
  x: number;
  y: number;
}

interface Direction {
  x: number;
  y: number;
}

const SnakeGame = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [snake, setSnake] = useState<Position[]>(INITIAL_SNAKE);
  const [direction, setDirection] = useState<Direction>(INITIAL_DIRECTION);
  const [food, setFood] = useState<Position>({ x: 15, y: 15 });
  const [score, setScore] = useState(0);
  const [gameState, setGameState] = useState<GameState>(GameState.PLAYING);
  const [highScore, setHighScore] = useState(0);
  const gameLoopRef = useRef<number>();
  const nextDirectionRef = useRef<Direction>(INITIAL_DIRECTION);

  // Generate random food position
  const generateFood = useCallback((currentSnake: Position[]): Position => {
    let newFood: Position;
    let isOnSnake: boolean;

    do {
      newFood = {
        x: Math.floor(Math.random() * GRID_SIZE),
        y: Math.floor(Math.random() * GRID_SIZE),
      };
      isOnSnake = currentSnake.some(
        (segment) => segment.x === newFood.x && segment.y === newFood.y
      );
    } while (isOnSnake);

    return newFood;
  }, []);

  // Check if snake collides with wall or itself
  const checkCollision = useCallback((head: Position, body: Position[]): boolean => {
    // Wall collision
    if (head.x < 0 || head.x >= GRID_SIZE || head.y < 0 || head.y >= GRID_SIZE) {
      return true;
    }

    // Self collision
    return body.some((segment) => segment.x === head.x && segment.y === head.y);
  }, []);

  // Game loop
  const gameLoop = useCallback(() => {
    setSnake((prevSnake) => {
      const currentDirection = nextDirectionRef.current;
      const newHead = {
        x: prevSnake[0].x + currentDirection.x,
        y: prevSnake[0].y + currentDirection.y,
      };

      // Check collision
      if (checkCollision(newHead, prevSnake)) {
        setGameState(GameState.GAME_OVER);
        return prevSnake;
      }

      const newSnake = [newHead, ...prevSnake];

      // Check if food is eaten
      if (newHead.x === food.x && newHead.y === food.y) {
        setScore((prev) => {
          const newScore = prev + 1;
          setHighScore((currentHigh) => Math.max(currentHigh, newScore));
          return newScore;
        });
        setFood(generateFood(newSnake));
      } else {
        // Remove tail if no food eaten
        newSnake.pop();
      }

      return newSnake;
    });
  }, [food, checkCollision, generateFood]);

  // Draw game on canvas
  const draw = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // Clear canvas
    ctx.fillStyle = "#1a1a1a";
    ctx.fillRect(0, 0, CANVAS_SIZE, CANVAS_SIZE);

    // Draw grid
    ctx.strokeStyle = "#2a2a2a";
    ctx.lineWidth = 1;
    for (let i = 0; i <= GRID_SIZE; i++) {
      ctx.beginPath();
      ctx.moveTo(i * CELL_SIZE, 0);
      ctx.lineTo(i * CELL_SIZE, CANVAS_SIZE);
      ctx.stroke();

      ctx.beginPath();
      ctx.moveTo(0, i * CELL_SIZE);
      ctx.lineTo(CANVAS_SIZE, i * CELL_SIZE);
      ctx.stroke();
    }

    // Draw snake
    snake.forEach((segment, index) => {
      ctx.fillStyle = index === 0 ? "#10b981" : "#22c55e";
      ctx.fillRect(
        segment.x * CELL_SIZE + 1,
        segment.y * CELL_SIZE + 1,
        CELL_SIZE - 2,
        CELL_SIZE - 2
      );
    });

    // Draw food
    ctx.fillStyle = "#ef4444";
    ctx.beginPath();
    ctx.arc(
      food.x * CELL_SIZE + CELL_SIZE / 2,
      food.y * CELL_SIZE + CELL_SIZE / 2,
      CELL_SIZE / 2 - 2,
      0,
      2 * Math.PI
    );
    ctx.fill();
  }, [snake, food]);

  // Handle keyboard input
  const handleKeyPress = useCallback(
    (e: KeyboardEvent) => {
      if (gameState !== GameState.PLAYING) return;

      const keyMap: { [key: string]: Direction } = {
        ArrowUp: { x: 0, y: -1 },
        ArrowDown: { x: 0, y: 1 },
        ArrowLeft: { x: -1, y: 0 },
        ArrowRight: { x: 1, y: 0 },
        w: { x: 0, y: -1 },
        s: { x: 0, y: 1 },
        a: { x: -1, y: 0 },
        d: { x: 1, y: 0 },
      };

      const newDirection = keyMap[e.key];
      if (!newDirection) return;

      // Prevent reversing direction
      const currentDirection = nextDirectionRef.current;
      if (
        newDirection.x === -currentDirection.x &&
        newDirection.y === -currentDirection.y
      ) {
        return;
      }

      nextDirectionRef.current = newDirection;
      setDirection(newDirection);
    },
    [gameState]
  );

  // Restart game
  const restartGame = useCallback(() => {
    setSnake(INITIAL_SNAKE);
    setDirection(INITIAL_DIRECTION);
    nextDirectionRef.current = INITIAL_DIRECTION;
    setFood(generateFood(INITIAL_SNAKE));
    setScore(0);
    setGameState(GameState.PLAYING);
  }, [generateFood]);

  // Setup game loop
  useEffect(() => {
    if (gameState === GameState.PLAYING) {
      gameLoopRef.current = window.setInterval(gameLoop, GAME_SPEED);
    } else {
      if (gameLoopRef.current) {
        clearInterval(gameLoopRef.current);
      }
    }

    return () => {
      if (gameLoopRef.current) {
        clearInterval(gameLoopRef.current);
      }
    };
  }, [gameState, gameLoop]);

  // Setup keyboard listener
  useEffect(() => {
    window.addEventListener("keydown", handleKeyPress);
    return () => window.removeEventListener("keydown", handleKeyPress);
  }, [handleKeyPress]);

  // Draw on every frame
  useEffect(() => {
    draw();
  }, [draw]);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-background p-4">
      <Card className="p-8 shadow-lg">
        <div className="flex flex-col items-center gap-6">
          {/* Header with Score */}
          <div className="flex justify-between items-center w-full max-w-md">
            <div className="text-2xl font-bold">
              Score: <span className="text-primary">{score}</span>
            </div>
            <div className="text-lg text-muted-foreground">
              High Score: {highScore}
            </div>
          </div>

          {/* Game Canvas */}
          <div className="relative">
            <canvas
              ref={canvasRef}
              width={CANVAS_SIZE}
              height={CANVAS_SIZE}
              className="border-4 border-border rounded-lg"
            />

            {/* Game Over Overlay */}
            {gameState === GameState.GAME_OVER && (
              <div className="absolute inset-0 bg-black/80 flex flex-col items-center justify-center rounded-lg">
                <div className="text-center space-y-6 p-8">
                  <h2 className="text-4xl font-bold text-white">Game Over!</h2>
                  <div className="space-y-2">
                    <p className="text-2xl text-white">
                      Final Score: <span className="text-primary font-bold">{score}</span>
                    </p>
                    {score === highScore && score > 0 && (
                      <p className="text-xl text-yellow-400 font-semibold">
                        🎉 New High Score! 🎉
                      </p>
                    )}
                  </div>
                  <Button
                    size="lg"
                    onClick={restartGame}
                    className="text-lg px-8 py-6"
                  >
                    Restart Game
                  </Button>
                </div>
              </div>
            )}
          </div>

          {/* Instructions */}
          <div className="text-center text-sm text-muted-foreground max-w-md">
            <p className="mb-2">
              Use <kbd className="px-2 py-1 bg-muted rounded">Arrow Keys</kbd> or{" "}
              <kbd className="px-2 py-1 bg-muted rounded">WASD</kbd> to move
            </p>
            <p>Eat the red food to grow and increase your score!</p>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default SnakeGame;
