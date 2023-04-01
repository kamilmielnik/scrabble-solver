import { Config, Locale } from '@scrabble-solver/types';

import bonuses from './bonuses';
import { tilesDe, tilesEn, tilesEs, tilesFa, tilesFr, tilesPl } from './tiles';

const base = {
  allTilesBonusScore: 50,
  blankScore: 0,
  blanksCount: 2,
  boardHeight: 15,
  boardWidth: 15,
  bonuses,
  id: 'scrabble',
  maximumCharactersCount: 7,
  name: 'Scrabble',
};

const scrabble = {
  id: base.id,
  name: base.name,
  [Locale.EN_GB]: Config.fromJson({ ...base, locale: Locale.EN_GB, tiles: tilesEn }),
  [Locale.DE_DE]: Config.fromJson({ ...base, locale: Locale.DE_DE, tiles: tilesDe }),
  [Locale.EN_US]: Config.fromJson({ ...base, locale: Locale.EN_US, tiles: tilesEn }),
  [Locale.ES_ES]: Config.fromJson({ ...base, locale: Locale.ES_ES, tiles: tilesEs }),
  [Locale.FA_IR]: Config.fromJson({ ...base, locale: Locale.FA_IR, tiles: tilesFa }),
  [Locale.FR_FR]: Config.fromJson({ ...base, locale: Locale.FR_FR, tiles: tilesFr }),
  [Locale.PL_PL]: Config.fromJson({ ...base, locale: Locale.PL_PL, tiles: tilesPl }),
};

export default scrabble;
