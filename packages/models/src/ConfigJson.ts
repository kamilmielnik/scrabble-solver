import BonusJson from './BonusJson';
import TileConfig from './TileConfig';

interface ConfigJson {
  allTilesBonusScore: number;
  blankScore: number;
  boardHeight: number;
  boardWidth: number;
  bonuses: BonusJson[];
  id: string;
  maximumNumberOfCharacters: number;
  name: string;
  numberOfBlanks: number;
  tiles: TileConfig[];
}

export default ConfigJson;
