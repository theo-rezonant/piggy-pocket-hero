import { useEffect, useState, useCallback, useRef } from 'react';
import {
  generateFoodPosition,
  isPositionOccupiedBySnake,
  positionsEqual,
  type Position,
} from './gameUtils';

// Game configuration
const GRID_SIZE = 20;
const CELL_SIZE = 20;
const INITIAL_SNAKE = [{ x: 10, y: 10 }];
const INITIAL_DIRECTION = { x: 1, y: 0 };
const GAME_SPEED = 150; // milliseconds

interface Direction {
  x: number;
  y: number;
}

const SnakeGame = () => {
  const [snake, setSnake] = useState<Position[]>(INITIAL_SNAKE);
  const [direction, setDirection] = useState<Direction>(INITIAL_DIRECTION);
  const [food, setFood] = useState<Position>(generateFoodPosition(INITIAL_SNAKE, GRID_SIZE));
  const [gameOver, setGameOver] = useState(false);
  const [score, setScore] = useState(0);
  const directionRef = useRef<Direction>(INITIAL_DIRECTION);

  // Update direction ref when direction changes
  useEffect(() => {
    directionRef.current = direction;
  }, [direction]);

  // Handle keyboard input
  const handleKeyPress = useCallback((event: KeyboardEvent) => {
    const currentDirection = directionRef.current;

    switch (event.key) {
      case 'ArrowUp':
        if (currentDirection.y === 0) {
          setDirection({ x: 0, y: -1 });
        }
        break;
      case 'ArrowDown':
        if (currentDirection.y === 0) {
          setDirection({ x: 0, y: 1 });
        }
        break;
      case 'ArrowLeft':
        if (currentDirection.x === 0) {
          setDirection({ x: -1, y: 0 });
        }
        break;
      case 'ArrowRight':
        if (currentDirection.x === 0) {
          setDirection({ x: 1, y: 0 });
        }
        break;
    }
  }, []);

  useEffect(() => {
    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [handleKeyPress]);

  // Game loop
  useEffect(() => {
    if (gameOver) return;

    const gameLoop = setInterval(() => {
      setSnake(prevSnake => {
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
        if (isPositionOccupiedBySnake(newHead, prevSnake)) {
          setGameOver(true);
          return prevSnake;
        }

        // Create new snake with new head
        const newSnake = [newHead, ...prevSnake];

        // Check if snake ate food
        if (positionsEqual(newHead, food)) {
          // Snake grows - don't remove tail
          setScore(prev => prev + 1);
          // Generate new food position that doesn't overlap with the new snake
          setFood(generateFoodPosition(newSnake, GRID_SIZE));
          return newSnake;
        } else {
          // Remove tail - snake doesn't grow
          newSnake.pop();
          return newSnake;
        }
      });
    }, GAME_SPEED);

    return () => clearInterval(gameLoop);
  }, [gameOver, food]);

  // Reset game
  const resetGame = () => {
    setSnake(INITIAL_SNAKE);
    setDirection(INITIAL_DIRECTION);
    directionRef.current = INITIAL_DIRECTION;
    setFood(generateFoodPosition(INITIAL_SNAKE, GRID_SIZE));
    setGameOver(false);
    setScore(0);
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-4">
      <div className="mb-4 text-center">
        <h1 className="text-3xl font-bold mb-2">Snake Game</h1>
        <p className="text-xl">Score: {score}</p>
        {gameOver && (
          <p className="text-red-600 font-bold text-xl mt-2">Game Over!</p>
        )}
      </div>

      <div
        className="border-4 border-gray-800 bg-white relative"
        style={{
          width: GRID_SIZE * CELL_SIZE,
          height: GRID_SIZE * CELL_SIZE,
        }}
      >
        {/* Render snake */}
        {snake.map((segment, index) => (
          <div
            key={`snake-${index}`}
            className="absolute bg-green-600 border border-green-700"
            style={{
              left: segment.x * CELL_SIZE,
              top: segment.y * CELL_SIZE,
              width: CELL_SIZE,
              height: CELL_SIZE,
            }}
          />
        ))}

        {/* Render food */}
        <div
          className="absolute bg-red-500 rounded-full"
          style={{
            left: food.x * CELL_SIZE,
            top: food.y * CELL_SIZE,
            width: CELL_SIZE,
            height: CELL_SIZE,
          }}
        />
      </div>

      <div className="mt-4 text-center">
        <button
          onClick={resetGame}
          className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          {gameOver ? 'Play Again' : 'Reset Game'}
        </button>
        <p className="mt-4 text-gray-600">Use arrow keys to control the snake</p>
      </div>
    </div>
  );
};

export default SnakeGame;
