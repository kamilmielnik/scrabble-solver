import { type Bingo } from './Bingo';
import { type BonusJson } from './BonusJson';
import { type Game } from './Game';
import { type Locale } from './Locale';
import { type TileConfig } from './TileConfig';

export interface ConfigJson {
  bingo: Bingo;
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
