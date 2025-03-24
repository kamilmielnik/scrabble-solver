import { BonusJson } from './BonusJson';
import { Game } from './Game';
import { Locale } from './Locale';
import { TileConfig } from './TileConfig';

export interface ConfigJson {
  bingoScore: number;
  blankScore: number;
  blanksCount: number;
  boardHeight: number;
  boardWidth: number;
  bonuses: BonusJson[];
  game: Game;
  locale: Locale;
  name: string;
  rackSize: number;
  tiles: TileConfig[];
}
