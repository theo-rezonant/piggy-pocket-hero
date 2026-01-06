import { useEffect } from "react";
import { useSnakeGame } from "@/hooks/useSnakeGame";
import { Direction } from "@/types/snake";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

const SnakeGame = () => {
  const { gameState, changeDirection, resetGame, togglePause, config } = useSnakeGame();

  // Handle keyboard input
  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      switch (e.key) {
        case "ArrowUp":
        case "w":
        case "W":
          e.preventDefault();
          changeDirection(Direction.UP);
          break;
        case "ArrowDown":
        case "s":
        case "S":
          e.preventDefault();
          changeDirection(Direction.DOWN);
          break;
        case "ArrowLeft":
        case "a":
        case "A":
          e.preventDefault();
          changeDirection(Direction.LEFT);
          break;
        case "ArrowRight":
        case "d":
        case "D":
          e.preventDefault();
          changeDirection(Direction.RIGHT);
          break;
        case " ":
          e.preventDefault();
          if (!gameState.isGameOver) {
            togglePause();
          }
          break;
        case "r":
        case "R":
          e.preventDefault();
          if (gameState.isGameOver) {
            resetGame();
          }
          break;
      }
    };

    window.addEventListener("keydown", handleKeyPress);
    return () => window.removeEventListener("keydown", handleKeyPress);
  }, [changeDirection, togglePause, resetGame, gameState.isGameOver]);

  const renderCell = (x: number, y: number) => {
    const isSnakeHead =
      gameState.snake.length > 0 &&
      gameState.snake[0].x === x &&
      gameState.snake[0].y === y;
    const isSnakeBody = gameState.snake.some(
      (segment, index) => index > 0 && segment.x === x && segment.y === y
    );
    const isFood = gameState.food.x === x && gameState.food.y === y;

    let className = "w-full h-full border border-gray-200";

    if (isSnakeHead) {
      className += " bg-green-600";
    } else if (isSnakeBody) {
      className += " bg-green-400";
    } else if (isFood) {
      className += " bg-red-500 rounded-full";
    } else {
      className += " bg-white";
    }

    return <div key={`${x}-${y}`} className={className} />;
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
      <div className="max-w-4xl w-full">
        <Card className="p-6">
          <div className="text-center mb-4">
            <h1 className="text-3xl font-bold mb-2">Snake Game</h1>
            <div className="flex justify-center gap-6 text-lg">
              <div>
                <span className="font-semibold">Score:</span> {gameState.score}
              </div>
              <div>
                <span className="font-semibold">Status:</span>{" "}
                {gameState.isGameOver
                  ? "Game Over"
                  : gameState.isPaused
                  ? "Paused"
                  : "Playing"}
              </div>
            </div>
          </div>

          {/* Game Board */}
          <div className="flex justify-center mb-4">
            <div
              className="bg-gray-50 border-4 border-gray-800 inline-block"
              style={{
                display: "grid",
                gridTemplateColumns: `repeat(${config.boardWidth}, ${config.cellSize}px)`,
                gridTemplateRows: `repeat(${config.boardHeight}, ${config.cellSize}px)`,
                gap: 0,
              }}
            >
              {Array.from({ length: config.boardHeight }, (_, y) =>
                Array.from({ length: config.boardWidth }, (_, x) => renderCell(x, y))
              )}
            </div>
          </div>

          {/* Game Over Overlay */}
          {gameState.isGameOver && (
            <div className="text-center mb-4">
              <div className="bg-red-100 border-2 border-red-500 rounded-lg p-6 mb-4">
                <h2 className="text-2xl font-bold text-red-700 mb-2">Game Over!</h2>
                <p className="text-lg text-red-600 mb-4">
                  Final Score: {gameState.score}
                </p>
                <Button onClick={resetGame} size="lg" variant="destructive">
                  Play Again (R)
                </Button>
              </div>
            </div>
          )}

          {/* Controls */}
          <div className="space-y-4">
            <div className="flex justify-center gap-4">
              {!gameState.isGameOver && (
                <Button onClick={togglePause} variant="outline">
                  {gameState.isPaused ? "Resume (Space)" : "Pause (Space)"}
                </Button>
              )}
              <Button onClick={resetGame} variant="outline">
                Restart Game
              </Button>
            </div>

            <div className="text-center text-sm text-gray-600">
              <p className="mb-2 font-semibold">Controls:</p>
              <div className="grid grid-cols-2 gap-2 max-w-md mx-auto">
                <div>Arrow Keys / WASD: Move</div>
                <div>Space: Pause/Resume</div>
                <div>R: Restart (when game over)</div>
              </div>
            </div>

            <div className="text-center text-xs text-gray-500 mt-4">
              <p className="font-semibold mb-1">Game Rules:</p>
              <ul className="space-y-1">
                <li>• Eat the red food to grow and earn points</li>
                <li>• Don't hit the walls (game over)</li>
                <li>• Don't collide with your own body (game over)</li>
              </ul>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default SnakeGame;
