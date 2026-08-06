import { type Locale } from '@scrabble-solver/types';

const generations: Partial<Record<Locale, number>> = {};

export const getDictionaryGeneration = (locale: Locale): number => generations[locale] ?? 0;

export const bumpDictionaryGeneration = (locale: Locale): void => {
  generations[locale] = getDictionaryGeneration(locale) + 1;
};
