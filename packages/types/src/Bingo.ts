import { isObject } from './isObject';

export type MultiplierBingo = { multiplier: number };

export type ScoreBingo = { score: number };

export type Bingo = MultiplierBingo | ScoreBingo;

export const isBingo = (value: unknown): value is Bingo => {
  return isScoreBingo(value) || isMultiplierBingo(value);
};

export const isScoreBingo = (value: unknown): value is ScoreBingo => {
  return isObject(value) && 'score' in value && typeof value.score === 'number';
};

export const isMultiplierBingo = (value: unknown): value is MultiplierBingo => {
  return isObject(value) && 'multiplier' in value && typeof value.multiplier === 'number';
};
