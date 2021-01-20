export interface CreatePlainTileOptions {
  cellIndex: number;
  character: string;
  color?: string;
  rowIndex: number;
  showPoints?: boolean;
}

export interface CreatePlainTilesOptions {
  color?: string;
  content: string[][];
  showPoints?: boolean;
}

export interface PlainTile {
  character: string;
  color: string;
  points?: number;
  size: number;
  transform: string;
  x: number;
  y: number;
}
