import { useEffect, useRef, useState, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

// Game state enum
enum GameState {
  PLAYING = "PLAYING",
  GAME_OVER = "GAME_OVER",
}

// Direction enum
enum Direction {
  UP = "UP",
  DOWN = "DOWN",
  LEFT = "LEFT",
  RIGHT = "RIGHT",
}

// Types
interface Position {
  x: number;
  y: number;
}

// Constants
const GRID_SIZE = 20;
const CELL_SIZE = 20;
const INITIAL_SNAKE: Position[] = [
  { x: 10, y: 10 },
  { x: 9, y: 10 },
  { x: 8, y: 10 },
];
const INITIAL_DIRECTION = Direction.RIGHT;
const GAME_SPEED = 150; // milliseconds

const SnakeGame = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [snake, setSnake] = useState<Position[]>(INITIAL_SNAKE);
  const [direction, setDirection] = useState<Direction>(INITIAL_DIRECTION);
  const [food, setFood] = useState<Position>({ x: 15, y: 15 });
  const [score, setScore] = useState<number>(0);
  const [gameState, setGameState] = useState<GameState>(GameState.PLAYING);
  const [isPaused, setIsPaused] = useState<boolean>(false);
  const gameLoopRef = useRef<number | null>(null);
  const lastDirectionRef = useRef<Direction>(INITIAL_DIRECTION);

  // Generate random food position
  const generateFood = useCallback((currentSnake: Position[]): Position => {
    let newFood: Position;
    do {
      newFood = {
        x: Math.floor(Math.random() * GRID_SIZE),
        y: Math.floor(Math.random() * GRID_SIZE),
      };
    } while (
      currentSnake.some((segment) => segment.x === newFood.x && segment.y === newFood.y)
    );
    return newFood;
  }, []);

  // Reset game function - implements the core requirement
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

  // Check collision with walls or self
  const checkCollision = useCallback((head: Position, body: Position[]): boolean => {
    // Wall collision
    if (head.x < 0 || head.x >= GRID_SIZE || head.y < 0 || head.y >= GRID_SIZE) {
      return true;
    }
    // Self collision
    return body.some((segment) => segment.x === head.x && segment.y === head.y);
  }, []);

  // Move snake
  const moveSnake = useCallback(() => {
    if (gameState !== GameState.PLAYING || isPaused) return;

    setSnake((prevSnake) => {
      const head = { ...prevSnake[0] };

      // Update head position based on direction
      switch (direction) {
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

      // Check collision
      if (checkCollision(head, prevSnake.slice(1))) {
        setGameState(GameState.GAME_OVER);
        return prevSnake;
      }

      const newSnake = [head, ...prevSnake];

      // Check if food is eaten
      if (head.x === food.x && head.y === food.y) {
        setScore((prev) => prev + 10);
        setFood(generateFood(newSnake));
      } else {
        newSnake.pop(); // Remove tail if no food eaten
      }

      lastDirectionRef.current = direction;
      return newSnake;
    });
  }, [direction, food, gameState, isPaused, checkCollision, generateFood]);

  // Handle keyboard input
  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if (gameState === GameState.GAME_OVER) return;

      const key = e.key.toLowerCase();
      const currentDirection = lastDirectionRef.current;

      switch (key) {
        case "arrowup":
        case "w":
          if (currentDirection !== Direction.DOWN) {
            setDirection(Direction.UP);
          }
          break;
        case "arrowdown":
        case "s":
          if (currentDirection !== Direction.UP) {
            setDirection(Direction.DOWN);
          }
          break;
        case "arrowleft":
        case "a":
          if (currentDirection !== Direction.RIGHT) {
            setDirection(Direction.LEFT);
          }
          break;
        case "arrowright":
        case "d":
          if (currentDirection !== Direction.LEFT) {
            setDirection(Direction.RIGHT);
          }
          break;
        case " ":
          e.preventDefault();
          setIsPaused((prev) => !prev);
          break;
      }
    };

    window.addEventListener("keydown", handleKeyPress);
    return () => window.removeEventListener("keydown", handleKeyPress);
  }, [gameState]);

  // Game loop
  useEffect(() => {
    if (gameState === GameState.PLAYING && !isPaused) {
      gameLoopRef.current = window.setInterval(moveSnake, GAME_SPEED);
    }

    return () => {
      if (gameLoopRef.current) {
        clearInterval(gameLoopRef.current);
      }
    };
  }, [moveSnake, gameState, isPaused]);

  // Draw game
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // Clear canvas
    ctx.fillStyle = "#1a1a2e";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Draw grid
    ctx.strokeStyle = "#16213e";
    for (let i = 0; i <= GRID_SIZE; i++) {
      ctx.beginPath();
      ctx.moveTo(i * CELL_SIZE, 0);
      ctx.lineTo(i * CELL_SIZE, GRID_SIZE * CELL_SIZE);
      ctx.stroke();
      ctx.beginPath();
      ctx.moveTo(0, i * CELL_SIZE);
      ctx.lineTo(GRID_SIZE * CELL_SIZE, i * CELL_SIZE);
      ctx.stroke();
    }

    // Draw snake
    snake.forEach((segment, index) => {
      ctx.fillStyle = index === 0 ? "#4ade80" : "#22c55e";
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

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-900 to-slate-800 flex items-center justify-center p-4">
      <Card className="w-full max-w-2xl bg-slate-800 border-slate-700">
        <CardContent className="p-6">
          <div className="space-y-4">
            {/* Header */}
            <div className="flex justify-between items-center">
              <h1 className="text-3xl font-bold text-white">Snake Game</h1>
              <div className="text-2xl font-bold text-green-400">
                Score: {score}
              </div>
            </div>

            {/* Game Canvas */}
            <div className="flex justify-center">
              <div className="relative">
                <canvas
                  ref={canvasRef}
                  width={GRID_SIZE * CELL_SIZE}
                  height={GRID_SIZE * CELL_SIZE}
                  className="border-4 border-slate-600 rounded-lg shadow-2xl"
                />

                {/* Game Over Overlay */}
                {gameState === GameState.GAME_OVER && (
                  <div className="absolute inset-0 bg-black/80 flex flex-col items-center justify-center rounded-lg">
                    <div className="text-center space-y-4 p-8">
                      <h2 className="text-4xl font-bold text-red-500 mb-2">
                        Game Over!
                      </h2>
                      <p className="text-2xl text-white mb-4">
                        Final Score: {score}
                      </p>
                      <Button
                        onClick={resetGame}
                        size="lg"
                        className="bg-green-600 hover:bg-green-700 text-white font-bold text-xl px-8 py-6"
                      >
                        Restart Game
                      </Button>
                    </div>
                  </div>
                )}

                {/* Pause Overlay */}
                {isPaused && gameState === GameState.PLAYING && (
                  <div className="absolute inset-0 bg-black/60 flex items-center justify-center rounded-lg">
                    <p className="text-3xl font-bold text-white">PAUSED</p>
                  </div>
                )}
              </div>
            </div>

            {/* Instructions */}
            <div className="bg-slate-700 p-4 rounded-lg">
              <h3 className="text-lg font-semibold text-white mb-2">Controls:</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm text-slate-300">
                <div>• Arrow Keys or WASD: Move snake</div>
                <div>• Space: Pause/Resume game</div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default SnakeGame;
