import { Locale } from '@scrabble-solver/types';

export interface Option {
  className: string;
  Icon: SvgComponent;
  label: string;
  value: Locale;
}
