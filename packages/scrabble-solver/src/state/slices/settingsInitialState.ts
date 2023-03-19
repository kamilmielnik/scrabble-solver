import { literaki, scrabble } from '@scrabble-solver/configs';
import { Locale } from '@scrabble-solver/types';

import { guessLocale } from 'lib';
import { AutoGroupTiles } from 'types';

import localStorage from '../localStorage';

export interface SettingsState {
  autoGroupTiles: AutoGroupTiles;
  configId: typeof literaki.id | typeof scrabble.id;
  locale: Locale;
}

const localStorageAutoGroupTiles = localStorage.getAutoGroupTiles();

const settingsInitialState: SettingsState = {
  autoGroupTiles: typeof localStorageAutoGroupTiles === 'undefined' ? 'left' : localStorageAutoGroupTiles,
  configId: localStorage.getConfigId() || scrabble.id,
  locale: localStorage.getLocale() || guessLocale(),
};

export default settingsInitialState;
