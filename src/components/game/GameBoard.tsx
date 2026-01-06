import { Position } from '@/types/snake';
import { BOARD_SIZE, CELL_SIZE, COLORS } from '@/constants/game';

interface GameBoardProps {
  snake: Position[];
}

const GameBoard = ({ snake }: GameBoardProps) => {
  // Create a 2D array to represent the board
  const board: string[][] = Array(BOARD_SIZE)
    .fill(null)
    .map(() => Array(BOARD_SIZE).fill('empty'));

  // Mark snake positions on the board
  snake.forEach((segment, index) => {
    if (segment.x >= 0 && segment.x < BOARD_SIZE && segment.y >= 0 && segment.y < BOARD_SIZE) {
      board[segment.y][segment.x] = index === 0 ? 'head' : 'body';
    }
  });

  const getCellColor = (cellType: string): string => {
    switch (cellType) {
      case 'head':
        return COLORS.snakeHead;
      case 'body':
        return COLORS.snake;
      default:
        return 'transparent';
    }
  };

  return (
    <div
      className="relative mx-auto border-4 border-gray-700 rounded-lg shadow-2xl"
      style={{
        width: BOARD_SIZE * CELL_SIZE,
        height: BOARD_SIZE * CELL_SIZE,
        backgroundColor: COLORS.board,
      }}
    >
      {/* Render grid */}
      <div className="absolute inset-0 grid"
        style={{
          gridTemplateColumns: `repeat(${BOARD_SIZE}, ${CELL_SIZE}px)`,
          gridTemplateRows: `repeat(${BOARD_SIZE}, ${CELL_SIZE}px)`,
        }}
      >
        {board.map((row, rowIndex) =>
          row.map((cell, colIndex) => (
            <div
              key={`${rowIndex}-${colIndex}`}
              className="border transition-colors duration-100"
              style={{
                borderColor: COLORS.grid,
                backgroundColor: getCellColor(cell),
                width: CELL_SIZE,
                height: CELL_SIZE,
              }}
            />
          ))
        )}
      </div>
    </div>
  );
};

export default GameBoard;
