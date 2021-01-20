import { Config, Locale } from '@scrabble-solver/types';

import bonuses from './bonuses';
import { tilesEn, tilesFr, tilesPl } from './tiles';

const base = {
  allTilesBonusScore: 50,
  blankScore: 0,
  boardHeight: 15,
  boardWidth: 15,
  bonuses,
  id: 'scrabble',
  maximumNumberOfCharacters: 7,
  name: 'Scrabble',
  numberOfBlanks: 2,
};

const scrabble = {
  id: base.id,
  name: base.name,
  [Locale.EN_GB]: Config.fromJson({ ...base, tiles: tilesEn }),
  [Locale.EN_US]: Config.fromJson({ ...base, tiles: tilesEn }),
  [Locale.FR_FR]: Config.fromJson({ ...base, tiles: tilesFr }),
  [Locale.PL_PL]: Config.fromJson({ ...base, tiles: tilesPl }),
};

export default scrabble;
