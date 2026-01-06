import { useState, useEffect, useCallback, useRef } from "react";
import ScoreDisplay from "@/components/game/ScoreDisplay";
import { Button } from "@/components/ui/button";

interface Position {
  x: number;
  y: number;
}

const GRID_SIZE = 20;
const CELL_SIZE = 20;
const INITIAL_SNAKE: Position[] = [{ x: 10, y: 10 }];
const INITIAL_DIRECTION = { x: 1, y: 0 };
const GAME_SPEED = 150; // milliseconds

const SnakeGame = () => {
  const [score, setScore] = useState(0);
  const [snake, setSnake] = useState<Position[]>(INITIAL_SNAKE);
  const [food, setFood] = useState<Position>({ x: 15, y: 15 });
  const [direction, setDirection] = useState<Position>(INITIAL_DIRECTION);
  const [gameOver, setGameOver] = useState(false);
  const [gameStarted, setGameStarted] = useState(false);
  const directionRef = useRef(direction);

  // Generate random food position
  const generateFood = useCallback((): Position => {
    return {
      x: Math.floor(Math.random() * GRID_SIZE),
      y: Math.floor(Math.random() * GRID_SIZE),
    };
  }, []);

  // Handle keyboard input
  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if (!gameStarted) return;

      const newDirection = { ...directionRef.current };

      switch (e.key) {
        case "ArrowUp":
          if (directionRef.current.y === 0) {
            newDirection.x = 0;
            newDirection.y = -1;
          }
          break;
        case "ArrowDown":
          if (directionRef.current.y === 0) {
            newDirection.x = 0;
            newDirection.y = 1;
          }
          break;
        case "ArrowLeft":
          if (directionRef.current.x === 0) {
            newDirection.x = -1;
            newDirection.y = 0;
          }
          break;
        case "ArrowRight":
          if (directionRef.current.x === 0) {
            newDirection.x = 1;
            newDirection.y = 0;
          }
          break;
        default:
          return;
      }

      directionRef.current = newDirection;
      setDirection(newDirection);
    };

    window.addEventListener("keydown", handleKeyPress);
    return () => window.removeEventListener("keydown", handleKeyPress);
  }, [gameStarted]);

  // Game loop
  useEffect(() => {
    if (!gameStarted || gameOver) return;

    const moveSnake = () => {
      setSnake((prevSnake) => {
        const head = prevSnake[0];
        const newHead = {
          x: head.x + directionRef.current.x,
          y: head.y + directionRef.current.y,
        };

        // Check wall collision
        if (
          newHead.x < 0 ||
          newHead.x >= GRID_SIZE ||
          newHead.y < 0 ||
          newHead.y >= GRID_SIZE
        ) {
          setGameOver(true);
          return prevSnake;
        }

        // Check self collision
        if (
          prevSnake.some((segment) => segment.x === newHead.x && segment.y === newHead.y)
        ) {
          setGameOver(true);
          return prevSnake;
        }

        const newSnake = [newHead, ...prevSnake];

        // Check food collision
        if (newHead.x === food.x && newHead.y === food.y) {
          setScore((prevScore) => prevScore + 1);
          setFood(generateFood());
          return newSnake; // Don't remove tail, snake grows
        }

        // Remove tail if no food eaten
        newSnake.pop();
        return newSnake;
      });
    };

    const gameInterval = setInterval(moveSnake, GAME_SPEED);
    return () => clearInterval(gameInterval);
  }, [gameStarted, gameOver, food, generateFood]);

  const startGame = () => {
    setScore(0);
    setSnake(INITIAL_SNAKE);
    setDirection(INITIAL_DIRECTION);
    directionRef.current = INITIAL_DIRECTION;
    setFood(generateFood());
    setGameOver(false);
    setGameStarted(true);
  };

  const resetGame = () => {
    setGameStarted(false);
    setScore(0);
    setSnake(INITIAL_SNAKE);
    setDirection(INITIAL_DIRECTION);
    directionRef.current = INITIAL_DIRECTION;
    setFood({ x: 15, y: 15 });
    setGameOver(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex flex-col items-center justify-center p-8">
      {/* Score Display - Always visible during gameplay */}
      {gameStarted && <ScoreDisplay score={score} />}

      <div className="text-center mb-8">
        <h1 className="text-4xl font-bold text-gray-800 mb-2">Snake Game</h1>
        <p className="text-gray-600">Use arrow keys to move the snake</p>
      </div>

      {/* Game Board */}
      <div
        className="relative bg-white rounded-lg shadow-2xl p-4 mb-6"
        style={{
          width: GRID_SIZE * CELL_SIZE + 32,
          height: GRID_SIZE * CELL_SIZE + 32,
        }}
      >
        <div
          className="relative border-2 border-gray-300 rounded"
          style={{
            width: GRID_SIZE * CELL_SIZE,
            height: GRID_SIZE * CELL_SIZE,
            backgroundImage: `
              linear-gradient(to right, #f0f0f0 1px, transparent 1px),
              linear-gradient(to bottom, #f0f0f0 1px, transparent 1px)
            `,
            backgroundSize: `${CELL_SIZE}px ${CELL_SIZE}px`,
          }}
        >
          {/* Snake */}
          {snake.map((segment, index) => (
            <div
              key={index}
              className="absolute transition-all duration-75"
              style={{
                left: segment.x * CELL_SIZE,
                top: segment.y * CELL_SIZE,
                width: CELL_SIZE,
                height: CELL_SIZE,
                backgroundColor: index === 0 ? "#22c55e" : "#4ade80",
                borderRadius: "2px",
              }}
            />
          ))}

          {/* Food */}
          <div
            className="absolute animate-pulse"
            style={{
              left: food.x * CELL_SIZE,
              top: food.y * CELL_SIZE,
              width: CELL_SIZE,
              height: CELL_SIZE,
              backgroundColor: "#ef4444",
              borderRadius: "50%",
            }}
          />

          {/* Game Over Overlay */}
          {gameOver && (
            <div className="absolute inset-0 bg-black/50 flex items-center justify-center rounded">
              <div className="bg-white p-6 rounded-lg text-center">
                <h2 className="text-2xl font-bold text-gray-800 mb-2">Game Over!</h2>
                <p className="text-gray-600 mb-4">Final Score: {score}</p>
                <Button onClick={resetGame}>Play Again</Button>
              </div>
            </div>
          )}

          {/* Start Screen */}
          {!gameStarted && !gameOver && (
            <div className="absolute inset-0 bg-black/30 flex items-center justify-center rounded">
              <Button onClick={startGame} size="lg">
                Start Game
              </Button>
            </div>
          )}
        </div>
      </div>

      {/* Instructions */}
      <div className="bg-white rounded-lg shadow-md p-4 max-w-md">
        <h3 className="font-semibold text-gray-800 mb-2">Instructions:</h3>
        <ul className="text-sm text-gray-600 space-y-1">
          <li>• Use arrow keys to control the snake</li>
          <li>• Eat the red food to grow and increase your score</li>
          <li>• Avoid hitting the walls and yourself</li>
          <li>• Each food eaten adds 1 point to your score</li>
        </ul>
      </div>
    </div>
  );
};

export default SnakeGame;
