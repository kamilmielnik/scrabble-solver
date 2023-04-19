import BonusJson from './BonusJson';
import Game from './Game';
import Locale from './Locale';
import TileConfig from './TileConfig';

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
