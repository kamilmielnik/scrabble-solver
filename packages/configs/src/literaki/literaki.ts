import { Config, Locale } from '@scrabble-solver/types';

import bonuses from './bonuses';
import { tilesDe, tilesEn, tilesEs, tilesFr, tilesPl } from './tiles';

const base = {
  allTilesBonusScore: 50,
  blankScore: 0,
  blanksCount: 2,
  boardHeight: 15,
  boardWidth: 15,
  bonuses,
  id: 'literaki',
  maximumCharactersCount: 7,
  name: 'Literaki',
};

const literaki = {
  id: base.id,
  name: base.name,
  [Locale.DE_DE]: Config.fromJson({ ...base, tiles: tilesDe }),
  [Locale.EN_GB]: Config.fromJson({ ...base, tiles: tilesEn }),
  [Locale.EN_US]: Config.fromJson({ ...base, tiles: tilesEn }),
  [Locale.ES_ES]: Config.fromJson({ ...base, tiles: tilesEs }),
  [Locale.FR_FR]: Config.fromJson({ ...base, tiles: tilesFr }),
  [Locale.PL_PL]: Config.fromJson({ ...base, tiles: tilesPl }),
};

export default literaki;
