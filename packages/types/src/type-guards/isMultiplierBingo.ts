import { type MultiplierBingo } from '../Bingo';

import { isObject } from './isObject';

export const isMultiplierBingo = (value: unknown): value is MultiplierBingo => {
  return isObject(value) && 'multiplier' in value && typeof value.multiplier === 'number';
};
