import { Locale } from '@scrabble-solver/types';

export interface Option {
  className: string;
  icon: BrowserSpriteSymbol;
  label: string;
  value: Locale;
}
