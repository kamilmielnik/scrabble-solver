import { type Gaddag } from '@kamilmielnik/gaddag';
import { type Board, type Config, type ResultJson, type Tile } from '@scrabble-solver/types';

import { MoveGenerator } from './MoveGenerator';

export interface SolveOptions {
  firstMoveWordMultiplier?: number;
}

export const solve = (
  gaddag: Gaddag,
  config: Config,
  board: Board,
  tiles: Tile[],
  options?: SolveOptions,
): ResultJson[] => {
  return new MoveGenerator(gaddag, config, board, tiles, options).run();
};
