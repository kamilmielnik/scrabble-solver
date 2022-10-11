import { Cell } from '@scrabble-solver/types';

export type Point = Pick<Cell, 'x' | 'y'>;

const cellFilterInitialState: Point[] = [];

export default cellFilterInitialState;
