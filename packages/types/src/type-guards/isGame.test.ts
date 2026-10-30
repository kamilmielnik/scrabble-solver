import { describe, expect, it } from 'bun:test';

import { Game } from '../Game';

import { isGame } from './isGame';

describe('isGame', () => {
  it.each(Object.values(Game))('accepts %s', (game) => {
    expect(isGame(game)).toBe(true);
  });

  it.each([
    ['null', null],
    ['undefined', undefined],
    ['a number', 0],
    ['NaN', Number.NaN],
    ['empty text', ''],
    ['an unknown game', 'monopoly'],
    ['a game in another case', 'Scrabble'],
    ['a game with stray spaces', ' scrabble '],
    ['an enum key rather than its value', 'ScrabbleDuel'],
    ['a locale', 'en-US'],
    ['an object', {}],
    ['an array holding a game', ['scrabble']],
  ])('rejects %s', (_name, value) => {
    expect(isGame(value)).toBe(false);
  });
});
