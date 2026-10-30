import { Locale } from '@scrabble-solver/types';

import { type Translations } from '../../types';
import type { RootState } from '../types';

import { i18nInitialState } from './initialState';
import { selectLoadedTranslations } from './selectors';
import { i18nSlice } from './slice';

const { actions, reducer } = i18nSlice;

describe('i18nSlice', () => {
  it('stores translations per locale', () => {
    const polish = { menu: 'pl' } as Translations;
    const german = { menu: 'de' } as Translations;
    const state = [
      actions.loaded({ locale: Locale.PL_PL, translations: polish }),
      actions.loaded({ locale: Locale.DE_DE, translations: german }),
    ].reduce(reducer, i18nInitialState);

    expect(selectLoadedTranslations({ i18n: state } as RootState)).toEqual({
      [Locale.DE_DE]: german,
      [Locale.PL_PL]: polish,
    });
  });
});
