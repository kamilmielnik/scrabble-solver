import { literaki, scrabble } from '@scrabble-solver/configs';
import { Locale } from '@scrabble-solver/types';

import { guessLocale } from 'lib';

import localStorage from '../localStorage';

export interface SettingsState {
  autoGroupTiles: 'left' | 'right' | null;
  configId: typeof literaki.id | typeof scrabble.id;
  locale: Locale;
}

const settingsInitialState: SettingsState = {
  autoGroupTiles: 'left',
  configId: localStorage.getConfigId() || scrabble.id,
  locale: localStorage.getLocale() || guessLocale(),
};

export default settingsInitialState;
