import { scrabble } from '@scrabble-solver/configs';
import { Locale } from '@scrabble-solver/types';

const settingsInitialState = {
  autoGroupTiles: 'left' as 'left' | 'right' | null,
  configId: scrabble.id,
  locale: Locale.EN_US,
};

export default settingsInitialState;
