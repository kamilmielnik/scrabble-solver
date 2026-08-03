import { type Gaddag } from '@scrabble-solver/gaddag';
import { type Board, type Config, type ResultJson, type Tile } from '@scrabble-solver/types';

import { MoveGenerator } from './MoveGenerator';

export const solve = (gaddag: Gaddag, config: Config, board: Board, tiles: Tile[]): ResultJson[] => {
  return new MoveGenerator(gaddag, config, board, tiles).run();
};
