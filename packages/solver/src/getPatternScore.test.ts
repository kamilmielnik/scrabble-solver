import { getConfig } from '@scrabble-solver/configs';
import { Board, Cell, Game, HorizontalPattern, Locale, Pattern, Tile, VerticalPattern } from '@scrabble-solver/types';

import { getPatternScore } from './getPatternScore';

describe('getPatternScore', () => {
  describe('Literaki - PL_PL', () => {
    const config = getConfig(Game.Literaki, Locale.PL_PL);
    const board = Board.fromStringArray([
      ' kasom         ',
      '     i         ',
      '     napiją    ',
      '  w  i         ',
      ' krabim        ',
      '  z            ',
      '  ę  eh        ',
      'f s srać       ',
      'i z t       s  ',
      'knebel      e  ',
      'a  ew     warcz',
      'ł  żyło  wody  ',
      'o     pecyj chu',
      '            y  ',
      '            t  ',
    ]);

    it('gives proper score without collisions (źaaaaaaź)', () => {
      const pattern = new Pattern(board, [
        new Cell({ x: 0, y: 0, tile: new Tile({ character: 'ź' }), isEmpty: true }),
        new Cell({ x: 1, y: 0, tile: new Tile({ character: 'a' }), isEmpty: true }),
        new Cell({ x: 2, y: 0, tile: new Tile({ character: 'a' }), isEmpty: true }),
        new Cell({ x: 3, y: 0, tile: new Tile({ character: 'a' }), isEmpty: true }),
        new Cell({ x: 4, y: 0, tile: new Tile({ character: 'a' }), isEmpty: true }),
        new Cell({ x: 5, y: 0, tile: new Tile({ character: 'a' }), isEmpty: true }),
        new Cell({ x: 6, y: 0, tile: new Tile({ character: 'a' }), isEmpty: true }),
        new Cell({ x: 7, y: 0, tile: new Tile({ character: 'ź' }), isEmpty: false }),
      ]);

      expect(getPatternScore(config, pattern)).toBe(128);
    });

    it('gives proper score with collisions (źaaaaaaź)', () => {
      const pattern = new HorizontalPattern(board, [
        new Cell({ x: 0, y: 0, tile: new Tile({ character: 'ź' }), isEmpty: true }),
        new Cell({ x: 1, y: 0, tile: new Tile({ character: 'a' }), isEmpty: true }),
        new Cell({ x: 2, y: 0, tile: new Tile({ character: 'a' }), isEmpty: true }),
        new Cell({ x: 3, y: 0, tile: new Tile({ character: 'a' }), isEmpty: true }),
        new Cell({ x: 4, y: 0, tile: new Tile({ character: 'a' }), isEmpty: true }),
        new Cell({ x: 5, y: 0, tile: new Tile({ character: 'a' }), isEmpty: true }),
        new Cell({ x: 6, y: 0, tile: new Tile({ character: 'a' }), isEmpty: true }),
        new Cell({ x: 7, y: 0, tile: new Tile({ character: 'ź' }), isEmpty: false }),
      ]);

      expect(getPatternScore(config, pattern)).toBe(133);
    });

    it('gives proper score with collisions (lino)', () => {
      const pattern = new VerticalPattern(board, [
        new Cell({ x: 2, y: 11, tile: new Tile({ character: 'l' }), isEmpty: true }),
        new Cell({ x: 2, y: 12, tile: new Tile({ character: 'i' }), isEmpty: true }),
        new Cell({ x: 2, y: 13, tile: new Tile({ character: 'n' }), isEmpty: true }),
        new Cell({ x: 2, y: 14, tile: new Tile({ character: 'o' }), isEmpty: true }),
      ]);

      expect(getPatternScore(config, pattern)).toBe(44);
    });

    it('gives proper score for blank', () => {
      const pattern = new HorizontalPattern(board, [
        new Cell({ x: 13, y: 14, tile: new Tile({ character: 'o', isBlank: true }), isEmpty: true }),
        new Cell({ x: 12, y: 14, tile: new Tile({ character: 't' }), isEmpty: false }),
      ]);

      expect(getPatternScore(config, pattern)).toBe(2);
    });

    it('gives 0 score for unknown characters', () => {
      const pattern = new HorizontalPattern(board, [
        new Cell({ x: 13, y: 14, tile: new Tile({ character: '?', isBlank: false }), isEmpty: true }),
        new Cell({ x: 12, y: 14, tile: new Tile({ character: 't' }), isEmpty: false }),
      ]);

      expect(getPatternScore(config, pattern)).toBe(2);
    });

    it('gives 50 points bonus for bingo', () => {
      const pattern = new HorizontalPattern(board, [
        new Cell({ x: 6, y: 14, tile: new Tile({ character: 'p' }), isEmpty: true }),
        new Cell({ x: 7, y: 14, tile: new Tile({ character: 'o' }), isEmpty: true }),
        new Cell({ x: 8, y: 14, tile: new Tile({ character: 'r' }), isEmpty: true }),
        new Cell({ x: 9, y: 14, tile: new Tile({ character: 'o' }), isEmpty: true }),
        new Cell({ x: 10, y: 14, tile: new Tile({ character: 'w' }), isEmpty: true }),
        new Cell({ x: 11, y: 14, tile: new Tile({ character: 'a', isBlank: true }), isEmpty: true }),
        new Cell({ x: 11, y: 14, tile: new Tile({ character: 't' }), isEmpty: false }),
        new Cell({ x: 13, y: 14, tile: new Tile({ character: 'e' }), isEmpty: true }),
      ]);

      expect(getPatternScore(config, pattern)).toBe(59);
    });
  });

  describe('Letter League - EN_US', () => {
    const config = getConfig(Game.LetterLeague, Locale.EN_US);
    const board = Board.create(config.boardWidth, config.boardHeight);

    it('gives double multiplier bonus for bingo', () => {
      const pattern = new HorizontalPattern(board, [
        new Cell({ x: 13, y: 6, tile: new Tile({ character: 'r' }), isEmpty: true }),
        new Cell({ x: 13, y: 7, tile: new Tile({ character: 'o' }), isEmpty: true }),
        new Cell({ x: 13, y: 8, tile: new Tile({ character: 'm' }), isEmpty: true }),
        new Cell({ x: 13, y: 9, tile: new Tile({ character: 'a' }), isEmpty: true }),
        new Cell({ x: 13, y: 10, tile: new Tile({ character: 'i' }), isEmpty: true }),
        new Cell({ x: 13, y: 11, tile: new Tile({ character: 'n' }), isEmpty: true }),
        new Cell({ x: 13, y: 12, tile: new Tile({ character: 'e' }), isEmpty: true }),
      ]);

      expect(getPatternScore(config, pattern)).toBe(18);
    });
  });
});
