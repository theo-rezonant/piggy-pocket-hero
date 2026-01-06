import { useEffect, useRef, useState, useCallback } from 'react';

// Direction types
type Direction = 'UP' | 'DOWN' | 'LEFT' | 'RIGHT';

// Grid settings
const GRID_SIZE = 20;
const CELL_SIZE = 20;
const CANVAS_WIDTH = GRID_SIZE * CELL_SIZE;
const CANVAS_HEIGHT = GRID_SIZE * CELL_SIZE;
const GAME_SPEED = 150; // milliseconds per tick

// Snake position type
interface Position {
  x: number;
  y: number;
}

const SnakeGame = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [snake, setSnake] = useState<Position[]>([
    { x: 10, y: 10 },
    { x: 9, y: 10 },
    { x: 8, y: 10 }
  ]);
  const [direction, setDirection] = useState<Direction>('RIGHT');
  const [nextDirection, setNextDirection] = useState<Direction>('RIGHT');
  const [food, setFood] = useState<Position>({ x: 15, y: 15 });
  const [gameOver, setGameOver] = useState(false);
  const [score, setScore] = useState(0);

  // Generate random food position
  const generateFood = useCallback((currentSnake: Position[]): Position => {
    let newFood: Position;
    do {
      newFood = {
        x: Math.floor(Math.random() * GRID_SIZE),
        y: Math.floor(Math.random() * GRID_SIZE)
      };
    } while (currentSnake.some(segment => segment.x === newFood.x && segment.y === newFood.y));
    return newFood;
  }, []);

  // Check if direction reversal is allowed
  const isValidDirectionChange = (current: Direction, next: Direction): boolean => {
    const opposites: Record<Direction, Direction> = {
      UP: 'DOWN',
      DOWN: 'UP',
      LEFT: 'RIGHT',
      RIGHT: 'LEFT'
    };
    return opposites[current] !== next;
  };

  // Handle keyboard input
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      const key = event.key;
      let newDirection: Direction | null = null;

      switch (key) {
        case 'ArrowUp':
          newDirection = 'UP';
          break;
        case 'ArrowDown':
          newDirection = 'DOWN';
          break;
        case 'ArrowLeft':
          newDirection = 'LEFT';
          break;
        case 'ArrowRight':
          newDirection = 'RIGHT';
          break;
        default:
          return;
      }

      // Prevent default arrow key behavior (scrolling)
      event.preventDefault();

      // Queue the direction change if it's valid
      if (newDirection && isValidDirectionChange(direction, newDirection)) {
        setNextDirection(newDirection);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [direction]);

  // Game loop
  useEffect(() => {
    if (gameOver) return;

    const gameLoop = setInterval(() => {
      setSnake(prevSnake => {
        // Apply the queued direction at the start of the tick
        const currentDirection = nextDirection;
        setDirection(currentDirection);

        // Calculate new head position based on current direction
        const head = prevSnake[0];
        let newHead: Position;

        switch (currentDirection) {
          case 'UP':
            newHead = { x: head.x, y: head.y - 1 };
            break;
          case 'DOWN':
            newHead = { x: head.x, y: head.y + 1 };
            break;
          case 'LEFT':
            newHead = { x: head.x - 1, y: head.y };
            break;
          case 'RIGHT':
            newHead = { x: head.x + 1, y: head.y };
            break;
        }

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
        if (prevSnake.some(segment => segment.x === newHead.x && segment.y === newHead.y)) {
          setGameOver(true);
          return prevSnake;
        }

        // Create new snake with new head
        const newSnake = [newHead, ...prevSnake];

        // Check if food is eaten
        if (newHead.x === food.x && newHead.y === food.y) {
          setScore(prev => prev + 10);
          setFood(generateFood(newSnake));
          // Don't remove tail (snake grows)
          return newSnake;
        }

        // Remove tail (snake moves)
        newSnake.pop();
        return newSnake;
      });
    }, GAME_SPEED);

    return () => clearInterval(gameLoop);
  }, [nextDirection, food, gameOver, generateFood]);

  // Draw game
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
    for (let i = 0; i <= GRID_SIZE; i++) {
      ctx.beginPath();
      ctx.moveTo(i * CELL_SIZE, 0);
      ctx.lineTo(i * CELL_SIZE, CANVAS_HEIGHT);
      ctx.stroke();

      ctx.beginPath();
      ctx.moveTo(0, i * CELL_SIZE);
      ctx.lineTo(CANVAS_WIDTH, i * CELL_SIZE);
      ctx.stroke();
    }

    // Draw food
    ctx.fillStyle = '#ef4444';
    ctx.fillRect(
      food.x * CELL_SIZE + 2,
      food.y * CELL_SIZE + 2,
      CELL_SIZE - 4,
      CELL_SIZE - 4
    );

    // Draw snake
    snake.forEach((segment, index) => {
      ctx.fillStyle = index === 0 ? '#22c55e' : '#16a34a';
      ctx.fillRect(
        segment.x * CELL_SIZE + 2,
        segment.y * CELL_SIZE + 2,
        CELL_SIZE - 4,
        CELL_SIZE - 4
      );
    });

    // Draw game over overlay
    if (gameOver) {
      ctx.fillStyle = 'rgba(0, 0, 0, 0.7)';
      ctx.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);

      ctx.fillStyle = '#ffffff';
      ctx.font = 'bold 24px Arial';
      ctx.textAlign = 'center';
      ctx.fillText('Game Over!', CANVAS_WIDTH / 2, CANVAS_HEIGHT / 2 - 20);

      ctx.font = '16px Arial';
      ctx.fillText(`Score: ${score}`, CANVAS_WIDTH / 2, CANVAS_HEIGHT / 2 + 10);
      ctx.fillText('Press R to restart', CANVAS_WIDTH / 2, CANVAS_HEIGHT / 2 + 35);
    }
  }, [snake, food, gameOver, score]);

  // Handle restart
  useEffect(() => {
    const handleRestart = (event: KeyboardEvent) => {
      if (event.key === 'r' || event.key === 'R') {
        setSnake([
          { x: 10, y: 10 },
          { x: 9, y: 10 },
          { x: 8, y: 10 }
        ]);
        setDirection('RIGHT');
        setNextDirection('RIGHT');
        setFood({ x: 15, y: 15 });
        setGameOver(false);
        setScore(0);
      }
    };

    if (gameOver) {
      window.addEventListener('keydown', handleRestart);
      return () => window.removeEventListener('keydown', handleRestart);
    }
  }, [gameOver]);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-900 p-4">
      <div className="mb-4">
        <h1 className="text-3xl font-bold text-white mb-2">Snake Game</h1>
        <div className="flex justify-between items-center text-white">
          <p className="text-xl">Score: {score}</p>
          <p className="text-sm ml-4">Use Arrow Keys to move</p>
        </div>
      </div>
      <canvas
        ref={canvasRef}
        width={CANVAS_WIDTH}
        height={CANVAS_HEIGHT}
        className="border-4 border-gray-700 rounded-lg shadow-2xl"
      />
      <div className="mt-4 text-gray-400 text-sm text-center">
        <p>🎮 Controls: Arrow Keys (↑ ↓ ← →)</p>
        <p className="mt-1">🚫 You cannot reverse direction!</p>
      </div>
    </div>
  );
};

export default SnakeGame;
