export interface PuzzleTileData {
  id: string;
  value: number;
  currentPosition: Position;
  targetPosition: Position;
  isBlank: boolean;
}

export interface Position {
  row: number;
  col: number;
}

export interface PuzzleState {
  tiles: PuzzleTileData[];
  size: number;
  isComplete: boolean;
  isEmpty: boolean;
  blankPosition: Position;
}

export interface PuzzleGameState {
  puzzle: PuzzleState;
  moves: number;
  startTime: number;
  endTime?: number;
  isPlaying: boolean;
  difficulty: PuzzleDifficulty;
  imageSource?: string;
  bestTime?: number;
  bestMoves?: number;
}

export interface PuzzleDifficulty {
  id: string;
  name: string;
  size: number;
  icon: string;
  isUnlocked: boolean;
  requiredCompleted?: string;
}

export interface PuzzleMove {
  tileId: string;
  fromPosition: Position;
  toPosition: Position;
  timestamp: number;
}

export interface PuzzleStats {
  totalGames: number;
  gamesWon: number;
  totalMoves: number;
  totalTime: number;
  bestTimes: Record<string, number>;
  bestMoves: Record<string, number>;
  difficultyProgress: Record<string, boolean>;
}

export interface TerritoryImage {
  id: string;
  name: string;
  source: string;
  description: string;
  theme: 'territory' | 'landmark' | 'marker' | 'art';
}

export type PuzzleTouchEvent = {
  position: Position;
  timestamp: number;
};