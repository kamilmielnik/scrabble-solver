import { BONUS_CHARACTER, BONUS_WORD } from '@scrabble-solver/constants';
import { Game } from '@scrabble-solver/types';

export const scrabbleDuel = {
  bingoScore: 50,
  blankScore: 0,
  blanksCount: 2,
  boardHeight: 11,
  boardWidth: 11,
  game: Game.ScrabbleDuel,
  name: 'Scrabble Duel',
  rackSize: 7,
  bonuses: [
    { multiplier: 2, type: BONUS_WORD, x: 5, y: 5 },

    { multiplier: 3, type: BONUS_WORD, x: 0, y: 0 },
    { multiplier: 3, type: BONUS_WORD, x: 10, y: 0 },
    { multiplier: 3, type: BONUS_WORD, x: 0, y: 10 },
    { multiplier: 3, type: BONUS_WORD, x: 10, y: 10 },

    { multiplier: 2, type: BONUS_WORD, x: 1, y: 1 },
    { multiplier: 2, type: BONUS_WORD, x: 2, y: 2 },
    { multiplier: 2, type: BONUS_WORD, x: 9, y: 1 },
    { multiplier: 2, type: BONUS_WORD, x: 8, y: 2 },
    { multiplier: 2, type: BONUS_WORD, x: 1, y: 9 },
    { multiplier: 2, type: BONUS_WORD, x: 2, y: 8 },
    { multiplier: 2, type: BONUS_WORD, x: 9, y: 9 },
    { multiplier: 2, type: BONUS_WORD, x: 8, y: 8 },

    { multiplier: 3, type: BONUS_CHARACTER, x: 3, y: 3 },
    { multiplier: 3, type: BONUS_CHARACTER, x: 3, y: 7 },
    { multiplier: 3, type: BONUS_CHARACTER, x: 7, y: 3 },
    { multiplier: 3, type: BONUS_CHARACTER, x: 7, y: 7 },

    { multiplier: 2, type: BONUS_CHARACTER, x: 4, y: 10 },
    { multiplier: 2, type: BONUS_CHARACTER, x: 5, y: 9 },
    { multiplier: 2, type: BONUS_CHARACTER, x: 6, y: 10 },

    { multiplier: 2, type: BONUS_CHARACTER, x: 10, y: 4 },
    { multiplier: 2, type: BONUS_CHARACTER, x: 9, y: 5 },
    { multiplier: 2, type: BONUS_CHARACTER, x: 10, y: 6 },

    { multiplier: 2, type: BONUS_CHARACTER, x: 4, y: 0 },
    { multiplier: 2, type: BONUS_CHARACTER, x: 5, y: 1 },
    { multiplier: 2, type: BONUS_CHARACTER, x: 6, y: 0 },

    { multiplier: 2, type: BONUS_CHARACTER, x: 0, y: 4 },
    { multiplier: 2, type: BONUS_CHARACTER, x: 1, y: 5 },
    { multiplier: 2, type: BONUS_CHARACTER, x: 0, y: 6 },

    { multiplier: 2, type: BONUS_CHARACTER, x: 4, y: 4 },
    { multiplier: 2, type: BONUS_CHARACTER, x: 6, y: 4 },
    { multiplier: 2, type: BONUS_CHARACTER, x: 4, y: 6 },
    { multiplier: 2, type: BONUS_CHARACTER, x: 6, y: 6 },
  ],
};
