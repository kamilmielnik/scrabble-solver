import { Cell, Locale, Result, Tile } from '@scrabble-solver/types';

import { type VerifiedWord } from '../types';

interface ResultOptions {
  blanks?: number[];
  collisions?: string[];
  id?: number;
  isHorizontal?: boolean;
  placed?: number[];
  points?: number;
  word?: string;
  x?: number;
  y?: number;
}

/**
 * `placed` lists the indices of the letters the move adds to the board; the other letters already lie on it.
 */
export function createResult({
  blanks = [],
  collisions = [],
  id = 1,
  isHorizontal = true,
  placed,
  points = 10,
  word = 'cat',
  x = 7,
  y = 7,
}: ResultOptions = {}): Result {
  const cells = Array.from(word).map((character, index) => {
    return new Cell({
      isEmpty: placed ? placed.includes(index) : true,
      tile: new Tile({ character, isBlank: blanks.includes(index) }),
      x: isHorizontal ? x + index : x,
      y: isHorizontal ? y : y + index,
    });
  });

  return new Result({
    cells,
    collisions: collisions.map((collision) => createCollision(collision, x, y)),
    id,
    locale: Locale.EN_US,
    points,
  });
}

export function createVerifiedWord(overrides: Partial<VerifiedWord> = {}): VerifiedWord {
  return { direction: 'horizontal', isValid: true, word: 'cat', x: 7, y: 7, ...overrides };
}

function createCollision(word: string, x: number, y: number): Cell[] {
  return Array.from(word).map((character, index) => {
    return new Cell({ isEmpty: true, tile: new Tile({ character }), x, y: y + index + 1 });
  });
}
