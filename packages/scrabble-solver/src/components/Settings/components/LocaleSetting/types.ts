import { Locale } from '@scrabble-solver/types';
import { FunctionComponent, SVGAttributes } from 'react';

export interface Option {
  className: string;
  icon: FunctionComponent<SVGAttributes<SVGElement>>;
  label: string;
  value: Locale;
}
