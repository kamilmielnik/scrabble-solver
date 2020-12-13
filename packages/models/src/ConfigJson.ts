import { BonusJson } from './Bonus';
import TileConfig from './TileConfig';

export default interface ConfigJson {
  id: string;
  name: string;
  allTilesBonusScore: number;
  blankScore: number;
  boardWidth: number;
  boardHeight: number;
  maximumNumberOfCharacters: number;
  numberOfBlanks: number;
  bonuses: BonusJson[];
  tiles: TileConfig[];
}
