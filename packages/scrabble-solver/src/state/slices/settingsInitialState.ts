import { literaki, scrabble } from '@scrabble-solver/configs';
import { Locale } from '@scrabble-solver/types';

import { guessLocale } from 'lib';

export interface SettingsState {
  autoGroupTiles: 'left' | 'right' | null;
  configId: typeof literaki.id | typeof scrabble.id;
  locale: Locale;
}

const settingsInitialState: SettingsState = {
  autoGroupTiles: 'left',
  configId: scrabble.id,
  locale: guessLocale(),
};

export default settingsInitialState;
