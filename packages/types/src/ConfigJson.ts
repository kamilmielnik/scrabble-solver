import type BonusJson from './BonusJson';
import type Game from './Game';
import type Locale from './Locale';
import type TileConfig from './TileConfig';

interface ConfigJson {
  allTilesBonusScore: number;
  blankScore: number;
  blanksCount: number;
  boardHeight: number;
  boardWidth: number;
  bonuses: BonusJson[];
  game: Game;
  locale: Locale;
  maximumCharactersCount: number;
  name: string;
  tiles: TileConfig[];
}

export default ConfigJson;
