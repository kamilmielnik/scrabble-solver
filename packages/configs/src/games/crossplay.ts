import { BONUS_CHARACTER, BONUS_WORD } from '@scrabble-solver/constants';
import { Game } from '@scrabble-solver/types';

export const crossplay = {
  bingo: { score: 40 },
  blankScore: 0,
  blanksCount: 3,
  boardHeight: 15,
  boardWidth: 15,
  game: Game.Crossplay,
  name: 'Crossplay',
  rackSize: 7,
    bonuses: [
        { multiplier: 3, type: BONUS_CHARACTER, x: 0, y: 0 },
        { multiplier: 3, type: BONUS_CHARACTER, x: 14, y: 0 },
        { multiplier: 3, type: BONUS_CHARACTER, x: 0, y: 14 },
        { multiplier: 3, type: BONUS_CHARACTER, x: 14, y: 14 },

        { multiplier: 3, type: BONUS_CHARACTER, x: 6, y: 1 },
        { multiplier: 3, type: BONUS_CHARACTER, x: 8, y: 1 },
        { multiplier: 3, type: BONUS_CHARACTER, x: 6, y: 13 },
        { multiplier: 3, type: BONUS_CHARACTER, x: 8, y: 13 },

        { multiplier: 3, type: BONUS_CHARACTER, x: 1, y: 6 },
        { multiplier: 3, type: BONUS_CHARACTER, x: 13, y: 6 },
        { multiplier: 3, type: BONUS_CHARACTER, x: 1, y: 8 },
        { multiplier: 3, type: BONUS_CHARACTER, x: 13, y: 8 },

        { multiplier: 3, type: BONUS_CHARACTER, x: 5, y: 4 },
        { multiplier: 3, type: BONUS_CHARACTER, x: 9, y: 4 },
        { multiplier: 3, type: BONUS_CHARACTER, x: 5, y: 10 },
        { multiplier: 3, type: BONUS_CHARACTER, x: 9, y: 10 },

        { multiplier: 3, type: BONUS_CHARACTER, x: 4, y: 5 },
        { multiplier: 3, type: BONUS_CHARACTER, x: 10, y: 5 },
        { multiplier: 3, type: BONUS_CHARACTER, x: 4, y: 9 },
        { multiplier: 3, type: BONUS_CHARACTER, x: 10, y: 9 },

        { multiplier: 2, type: BONUS_CHARACTER, x: 4, y: 2 },
        { multiplier: 2, type: BONUS_CHARACTER, x: 10, y: 2 },
        { multiplier: 2, type: BONUS_CHARACTER, x: 4, y: 12 },
        { multiplier: 2, type: BONUS_CHARACTER, x: 10, y: 12 },

        { multiplier: 2, type: BONUS_CHARACTER, x: 2, y: 4 },
        { multiplier: 2, type: BONUS_CHARACTER, x: 12, y: 4 },
        { multiplier: 2, type: BONUS_CHARACTER, x: 2, y: 10 },
        { multiplier: 2, type: BONUS_CHARACTER, x: 12, y: 10 },

        { multiplier: 2, type: BONUS_CHARACTER, x: 3, y: 3 },
        { multiplier: 2, type: BONUS_CHARACTER, x: 11, y: 3 },
        { multiplier: 2, type: BONUS_CHARACTER, x: 3, y: 11 },
        { multiplier: 2, type: BONUS_CHARACTER, x: 11, y: 11 },

        { multiplier: 2, type: BONUS_CHARACTER, x: 0, y: 7 }, 
        { multiplier: 2, type: BONUS_CHARACTER, x: 14, y: 7 }, 

        { multiplier: 2, type: BONUS_CHARACTER, x: 7, y: 0 }, 
        { multiplier: 2, type: BONUS_CHARACTER, x: 7, y: 14 }, 

        { multiplier: 2, type: BONUS_CHARACTER, x: 7, y: 5 }, 
        { multiplier: 2, type: BONUS_CHARACTER, x: 7, y: 9 },

        { multiplier: 2, type: BONUS_CHARACTER, x: 5, y: 7 }, 
        { multiplier: 2, type: BONUS_CHARACTER, x: 9, y: 7 },

        { multiplier: 2, type: BONUS_WORD, x: 1, y: 1 },
        { multiplier: 2, type: BONUS_WORD, x: 13, y: 1 },
        { multiplier: 2, type: BONUS_WORD, x: 1, y: 13 },
        { multiplier: 2, type: BONUS_WORD, x: 13, y: 13 },

        { multiplier: 2, type: BONUS_WORD, x: 3, y: 7 },
        { multiplier: 2, type: BONUS_WORD, x: 11, y: 7 },

        { multiplier: 2, type: BONUS_WORD, x: 7, y: 3 },
        { multiplier: 2, type: BONUS_WORD, x: 7, y: 11 },

        { multiplier: 3, type: BONUS_WORD, x: 3, y: 0 },
        { multiplier: 3, type: BONUS_WORD, x: 11, y: 0 },
        { multiplier: 3, type: BONUS_WORD, x: 3, y: 14 },
        { multiplier: 3, type: BONUS_WORD, x: 11, y: 14 },

        { multiplier: 3, type: BONUS_WORD, x: 0, y: 3 },
        { multiplier: 3, type: BONUS_WORD, x: 14, y: 3 },
        { multiplier: 3, type: BONUS_WORD, x: 0, y: 11 },
        { multiplier: 3, type: BONUS_WORD, x: 14, y: 11 },
    ],
};
