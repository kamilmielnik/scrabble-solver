import { Locale } from '@scrabble-solver/types';

import { type Translations } from '@/types';

import english from './languages/english.json';

/**
 * English ships in the main bundle so the SSR and the pre-hydration UI
 * always have complete translations.
 */
export const englishTranslations: Translations = english;

const loadTranslationsPerLocale: Record<Locale, () => Promise<Translations>> = {
  [Locale.DE_DE]: async () => (await import('./languages/german.json')).default,
  [Locale.EN_GB]: async () => english,
  [Locale.EN_US]: async () => english,
  [Locale.ES_ES]: async () => (await import('./languages/spanish.json')).default,
  [Locale.FA_IR]: async () => (await import('./languages/persian.json')).default,
  [Locale.FR_FR]: async () => (await import('./languages/french.json')).default,
  [Locale.PL_PL]: async () => (await import('./languages/polish.json')).default,
  [Locale.RO_RO]: async () => (await import('./languages/romanian.json')).default,
  [Locale.TR_TR]: async () => (await import('./languages/turkish.json')).default,
};

export const loadTranslations = (locale: Locale): Promise<Translations> => loadTranslationsPerLocale[locale]();
