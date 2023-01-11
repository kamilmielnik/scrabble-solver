import { Config, Locale } from '@scrabble-solver/types';

import bonuses from './bonuses';
import { tilesEn, tilesEs, tilesFa, tilesFr, tilesPl, tilesDe } from './tiles';

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
  [Locale.EN_GB]: Config.fromJson({ ...base, tiles: tilesEn }),
  [Locale.DE_DE]: Config.fromJson({ ...base, tiles: tilesDe }),
  [Locale.EN_US]: Config.fromJson({ ...base, tiles: tilesEn }),
  [Locale.ES_ES]: Config.fromJson({ ...base, tiles: tilesEs }),
  [Locale.FA_FA]: Config.fromJson({ ...base, tiles: tilesFa }),
  [Locale.FR_FR]: Config.fromJson({ ...base, tiles: tilesFr }),
  [Locale.PL_PL]: Config.fromJson({ ...base, tiles: tilesPl }),
};

export default scrabble;
