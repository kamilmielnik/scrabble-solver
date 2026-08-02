import { type Measurement } from './types';

export const getMeasurement = (measurements: Measurement[], label: string, blanksCount: number): Measurement => {
  const measurement = measurements.find(
    (candidate) => candidate.label === label && candidate.blanksCount === blanksCount,
  );

  if (!measurement) {
    throw new Error(`Missing measurement for "${label}" with ${blanksCount} blanks`);
  }

  return measurement;
};

export const median = (values: number[]): number => {
  const sorted = [...values].sort((a, b) => a - b);
  const middle = Math.floor(sorted.length / 2);
  return sorted.length % 2 === 0 ? (sorted[middle - 1] + sorted[middle]) / 2 : sorted[middle];
};

export const formatDuration = (milliseconds: number): string => {
  return milliseconds < 1000 ? `${Math.round(milliseconds)} ms` : `${(milliseconds / 1000).toFixed(1)} s`;
};

export const formatBlanksCount = (blanksCount: number): string => {
  return blanksCount === 1 ? '1 blank' : `${blanksCount} blanks`;
};

export const formatInteger = (value: number): string => value.toLocaleString('en-US');

export const unique = <T>(values: T[]): T[] => [...new Set(values)];
