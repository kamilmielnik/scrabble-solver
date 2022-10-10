import { EMPTY_CELL } from '@scrabble-solver/constants';
import { Board, Cell, Config } from '@scrabble-solver/types';

import PatternsGenerator from './PatternsGenerator';

const board = Board.fromStringArray([' t ', 'do ', '   ']);

const patternsGenerator = new PatternsGenerator({
  boardHeight: 3,
  boardWidth: 3,
  maximumCharactersCount: 7,
} as Config);

describe('PatternsGenerator', () => {
  const emptyCell: Cell = { hasTile: () => false } as Cell;
  const filledCell: Cell = { hasTile: () => true } as Cell;

  it('generates start indices', () => {
    const cells = [filledCell, filledCell, emptyCell, emptyCell, emptyCell, filledCell];
    const startIndices = patternsGenerator.generateStartIndices(cells);
    expect(startIndices).toEqual([0, 3, 4]);
  });

  it('generates end indices', () => {
    const tests = [
      {
        input: patternsGenerator.generateEndIndices(
          [filledCell, filledCell, emptyCell, emptyCell, emptyCell, filledCell],
          3,
        ),
        output: [5],
      },
      {
        input: patternsGenerator.generateEndIndices(
          [filledCell, filledCell, emptyCell, emptyCell, emptyCell, filledCell, emptyCell],
          3,
        ),
        output: [5, 6],
      },
    ];

    tests.forEach(({ input, output }) => expect(input).toEqual(output));
  });

  it('generates vectors', () => {
    const vectors = patternsGenerator.generateVectors({
      getNthVector: () => [],
      vectorsCount: 3,
    });
    expect(vectors.length).toBe(3);
    expect(vectors).toEqual([[], [], []]);
  });

  it('generates some vertical patterns', () => {
    const vertical = patternsGenerator.generateVertical(board);
    expect(vertical.length).toBeGreaterThan(0);
  });

  it('generates proper vertical patterns', () => {
    const vertical = patternsGenerator.generateVertical(board);
    expect(vertical.map(({ cells }) => cells.map(String))).toEqual([
      [EMPTY_CELL, 'd'],
      [EMPTY_CELL, 'd', EMPTY_CELL],
      ['d', EMPTY_CELL],
      ['t', 'o', EMPTY_CELL],
      [EMPTY_CELL, EMPTY_CELL],
      [EMPTY_CELL, EMPTY_CELL, EMPTY_CELL],
      [EMPTY_CELL, EMPTY_CELL],
    ]);
  });

  it('generates some horizontal patterns', () => {
    const horizontal = patternsGenerator.generateHorizontal(board);
    expect(horizontal.length).toBeGreaterThan(0);
  });

  it('generates proper horizontal patterns', () => {
    const horizontal = patternsGenerator.generateHorizontal(board);
    expect(horizontal.map(({ cells }) => cells.map(String))).toEqual([
      [EMPTY_CELL, 't'],
      [EMPTY_CELL, 't', EMPTY_CELL],
      ['t', EMPTY_CELL],
      ['d', 'o', EMPTY_CELL],
      [EMPTY_CELL, EMPTY_CELL],
      [EMPTY_CELL, EMPTY_CELL, EMPTY_CELL],
      [EMPTY_CELL, EMPTY_CELL],
    ]);
  });
});
