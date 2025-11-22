
export type PieceId = 'I' | 'O' | 'T' | 'L' | 'J' | 'S' | 'Z';

export type PieceShape = number[][];

export interface PieceDefinition {
  id: PieceId;
  shapes: PieceShape[];
  color: string;
}

export interface PieceInstance {
  definition: PieceDefinition;
  instanceId: number;
  isPlaced: boolean;
  position: { x: number; y: number };
  rotation: number;
}

export type BoardCell = string | null;
export type BoardState = (BoardCell)[][];

export type GameState = 'playing' | 'won' | 'timeup' | 'finished';

export interface GhostPosition {
    shape: PieceShape;
    position: { x: number; y: number };
    color: string;
    isValid: boolean;
}
