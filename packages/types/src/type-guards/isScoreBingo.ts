import { type ScoreBingo } from '../Bingo';

import { isObject } from './isObject';

export const isScoreBingo = (value: unknown): value is ScoreBingo => {
  return isObject(value) && 'score' in value && typeof value.score === 'number';
};
