import { type Bingo } from '../Bingo';

import { isMultiplierBingo } from './isMultiplierBingo';
import { isScoreBingo } from './isScoreBingo';

export const isBingo = (value: unknown): value is Bingo => {
  return isScoreBingo(value) || isMultiplierBingo(value);
};
