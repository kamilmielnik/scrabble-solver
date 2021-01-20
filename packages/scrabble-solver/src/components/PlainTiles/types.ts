export interface CreateTileOptions {
  cellIndex: number;
  character: string;
  color?: string;
  rowIndex: number;
  showPoints?: boolean;
}

export interface CreateTilesOptions {
  color?: string;
  content: string[][];
  showPoints?: boolean;
}
