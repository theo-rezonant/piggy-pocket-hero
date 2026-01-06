export interface Position {
  x: number;
  y: number;
}

export enum Direction {
  UP = "UP",
  DOWN = "DOWN",
  LEFT = "LEFT",
  RIGHT = "RIGHT",
}

export interface GameState {
  snake: Position[];
  direction: Direction;
  food: Position;
  score: number;
  isGameOver: boolean;
  isPaused: boolean;
}

export interface GameConfig {
  boardWidth: number;
  boardHeight: number;
  cellSize: number;
  initialSnakeLength: number;
  gameSpeed: number;
}
