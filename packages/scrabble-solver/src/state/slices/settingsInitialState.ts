import { scrabble } from '@scrabble-solver/configs';

import { Locale } from 'types';

const settingsInitialState = {
  autoGroupTiles: 'left' as 'left' | 'right' | null,
  configId: scrabble.id,
  locale: 'en-US' as Locale,
};

export default settingsInitialState;
