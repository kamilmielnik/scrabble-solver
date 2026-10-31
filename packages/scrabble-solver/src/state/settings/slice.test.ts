import { Game, Locale } from '@scrabble-solver/types';

import { settingsInitialState } from './initialState';
import { settingsSlice } from './slice';

const { actions, reducer } = settingsSlice;

describe('settingsSlice', () => {
  it.each([
    ['autoGroupTiles', actions.changeAutoGroupTiles('left'), 'left'],
    ['game', actions.changeGame(Game.Literaki), Game.Literaki],
    ['highlightUnreachableCells', actions.changeHighlightUnreachableCells(true), true],
    ['inputMode', actions.changeInputMode('touchscreen'), 'touchscreen'],
    ['locale', actions.changeLocale(Locale.PL_PL), Locale.PL_PL],
    ['showCoordinates', actions.changeShowCoordinates('alternative'), 'alternative'],
    ['removeCellFilters', actions.changeRemoveCellFilters('never'), 'never'],
  ] as const)('changes only %s', (key, action, value) => {
    expect(reducer(settingsInitialState, action)).toEqual({ ...settingsInitialState, [key]: value });
  });

  describe('init', () => {
    it('merges a partial state over the current one', () => {
      expect(reducer(settingsInitialState, actions.init({ game: Game.Literaki }))).toEqual({
        ...settingsInitialState,
        game: Game.Literaki,
      });
    });

    it('keeps the state identity when nothing differs', () => {
      expect(reducer(settingsInitialState, actions.init({ game: settingsInitialState.game }))).toBe(
        settingsInitialState,
      );
    });
  });
});
