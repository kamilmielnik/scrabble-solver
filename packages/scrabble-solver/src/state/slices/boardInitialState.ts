import { getConfig } from '@scrabble-solver/configs';
import { Board } from '@scrabble-solver/types';

import localStorage from '../localStorage';

import settingsInitialState from './settingsInitialState';

export type BoardState = Board;

const { game, locale } = settingsInitialState;
const { boardSize } = getConfig(game, locale);
export const boardDefaultState = Board.create(boardSize);

const boardInitialState: BoardState = localStorage.getBoard() || boardDefaultState;

// const createOxyphenbutazone = () => {
//   // Tiles: oypbaze

//   const board = Board.fromStringArray([
//     ' x  hen ut  on ',
//     'puer  or amas j',
//     'a led  a  er  a',
//     'c ki   i elf  c',
//     'i snot n  is  u',
//     'f  t o w do   l',
//     'y  e moa er   a',
//     'i  r   solar  t',
//     'n  v   h  t   i',
//     'g  i   i bitten',
//     '   e   n  v   g',
//     '   w   g  e    ',
//     '   e           ',
//     '   d           ',
//     '               ',
//   ]);

//   board.rows[4][3].tile.isBlank = true;
//   board.rows[9][11].tile.isBlank = true;

//   return board;
// };

export default boardInitialState;
