import { useState, useEffect, useCallback } from 'react';
import GameBoard from './GameBoard';
import { Direction, Position } from '@/types/snake';
import {
  INITIAL_SNAKE_POSITION,
  INITIAL_SNAKE_LENGTH,
  INITIAL_DIRECTION,
  SNAKE_SPEED,
} from '@/constants/game';
import {
  initializeSnake,
  moveSnake,
  isOutOfBounds,
  checkSelfCollision,
} from '@/utils/snakeLogic';

const SnakeGame = () => {
  const [snake, setSnake] = useState<Position[]>(() =>
    initializeSnake(
      INITIAL_SNAKE_POSITION.x,
      INITIAL_SNAKE_POSITION.y,
      INITIAL_SNAKE_LENGTH
    )
  );
  const [direction, setDirection] = useState<Direction>(INITIAL_DIRECTION);
  const [isGameOver, setIsGameOver] = useState(false);

  // Game loop - moves snake at constant speed
  useEffect(() => {
    if (isGameOver) return;

    const gameInterval = setInterval(() => {
      setSnake((prevSnake) => {
        const newSnake = moveSnake(prevSnake, direction);
        const head = newSnake[0];

        // Check for collisions
        if (isOutOfBounds(head) || checkSelfCollision(head, prevSnake)) {
          setIsGameOver(true);
          return prevSnake;
        }

        return newSnake;
      });
    }, SNAKE_SPEED);

    return () => clearInterval(gameInterval);
  }, [direction, isGameOver]);

  // Handle keyboard input (for future implementation)
  const handleKeyPress = useCallback((event: KeyboardEvent) => {
    if (isGameOver) return;

    switch (event.key) {
      case 'ArrowUp':
        setDirection((prev) => (prev !== 'DOWN' ? 'UP' : prev));
        break;
      case 'ArrowDown':
        setDirection((prev) => (prev !== 'UP' ? 'DOWN' : prev));
        break;
      case 'ArrowLeft':
        setDirection((prev) => (prev !== 'RIGHT' ? 'LEFT' : prev));
        break;
      case 'ArrowRight':
        setDirection((prev) => (prev !== 'LEFT' ? 'RIGHT' : prev));
        break;
    }
  }, [isGameOver]);

  useEffect(() => {
    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [handleKeyPress]);

  const resetGame = () => {
    setSnake(
      initializeSnake(
        INITIAL_SNAKE_POSITION.x,
        INITIAL_SNAKE_POSITION.y,
        INITIAL_SNAKE_LENGTH
      )
    );
    setDirection(INITIAL_DIRECTION);
    setIsGameOver(false);
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 p-8">
      <div className="mb-8 text-center">
        <h1 className="text-4xl font-bold text-white mb-2">Snake Game</h1>
        <p className="text-gray-400">
          {isGameOver
            ? 'Game Over! Click Reset to play again'
            : 'Snake is moving automatically'}
        </p>
      </div>

      <GameBoard snake={snake} />

      <div className="mt-8 flex flex-col items-center gap-4">
        <div className="text-white text-lg">
          <span className="font-semibold">Length:</span> {snake.length}
        </div>

        {isGameOver && (
          <button
            onClick={resetGame}
            className="px-6 py-3 bg-green-600 hover:bg-green-700 text-white font-semibold rounded-lg shadow-lg transition-colors duration-200"
          >
            Reset Game
          </button>
        )}

        <div className="text-gray-400 text-sm text-center max-w-md">
          <p className="mb-2">Use arrow keys to control the snake (coming in future updates)</p>
          <p>Currently: Snake moves automatically to the right</p>
        </div>
      </div>
    </div>
  );
};

export default SnakeGame;
