import { EMPTY_CELL } from '@scrabble-solver/constants';
import { Board } from '@scrabble-solver/models';

import PatternsGenerator from '../patterns-generator';

const board = Board.fromStringArray([' t ', 'do ', '   ']);

const patternsGenerator = new PatternsGenerator({
  boardHeight: 3,
  boardWidth: 3
});

describe('PatternsGenerator', () => {
  const emptyCell = { hasTile: () => false };
  const filledCell = { hasTile: () => true };

  it('generates start indices', () => {
    const startIndices = patternsGenerator.generateStartIndices({
      cells: [filledCell, filledCell, emptyCell, emptyCell, emptyCell, filledCell]
    });
    expect(startIndices).toEqual([0, 3, 4]);
  });

  it('generates end indices', () => {
    const tests = [
      {
        input: {
          cells: [filledCell, filledCell, emptyCell, emptyCell, emptyCell, filledCell],
          startIndex: 3
        },
        output: [5]
      },
      {
        input: {
          cells: [filledCell, filledCell, emptyCell, emptyCell, emptyCell, filledCell, emptyCell],
          startIndex: 3
        },
        output: [5, 6]
      }
    ];

    tests.forEach(({ input, output }) => expect(patternsGenerator.generateEndIndices(input)).toEqual(output));
  });

  it('generates vectors', () => {
    const vectors = patternsGenerator.generateVectors({
      getNthVector: (index) => index,
      numberOfVectors: 3
    });
    expect(vectors.length).toBe(3);
    expect(vectors).toEqual([0, 1, 2]);
  });

  it('generates some vertical patterns', () => {
    const { vertical } = patternsGenerator.generate(board);
    expect(vertical.length).toBeGreaterThan(0);
  });

  it('generates proper vertical patterns', () => {
    const { vertical } = patternsGenerator.generate(board);
    expect(vertical.map(({ cells }) => cells.map(String))).toEqual([
      [EMPTY_CELL, 'd'],
      [EMPTY_CELL, 'd', EMPTY_CELL],
      ['d', EMPTY_CELL],
      ['t', 'o', EMPTY_CELL],
      [EMPTY_CELL, EMPTY_CELL],
      [EMPTY_CELL, EMPTY_CELL, EMPTY_CELL],
      [EMPTY_CELL, EMPTY_CELL]
    ]);
  });

  it('generates some horizontal patterns', () => {
    const { horizontal } = patternsGenerator.generate(board);
    expect(horizontal.length).toBeGreaterThan(0);
  });

  it('generates proper horizontal patterns', () => {
    const { horizontal } = patternsGenerator.generate(board);
    expect(horizontal.map(({ cells }) => cells.map(String))).toEqual([
      [EMPTY_CELL, 't'],
      [EMPTY_CELL, 't', EMPTY_CELL],
      ['t', EMPTY_CELL],
      ['d', 'o', EMPTY_CELL],
      [EMPTY_CELL, EMPTY_CELL],
      [EMPTY_CELL, EMPTY_CELL, EMPTY_CELL],
      [EMPTY_CELL, EMPTY_CELL]
    ]);
  });
});
