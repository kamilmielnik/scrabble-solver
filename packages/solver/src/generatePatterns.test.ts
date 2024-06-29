import { getConfig } from '@scrabble-solver/configs';
import { Board, Game, Locale } from '@scrabble-solver/types';

import generatePatterns from './generatePatterns';

describe('generatePatterns', () => {
  it('Generates all patterns for an empty board', () => {
    const config = getConfig(Game.Scrabble, Locale.EN_US);
    const board = Board.create(config.boardSize);

    expect(generatePatterns(config, board).length).toEqual(54);
  });
});
