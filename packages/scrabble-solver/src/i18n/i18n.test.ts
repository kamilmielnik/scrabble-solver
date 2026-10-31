/* eslint-disable @typescript-eslint/no-unsafe-argument */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */

import { games, languages } from '@scrabble-solver/configs';
import { Locale } from '@scrabble-solver/types';
import { readdirSync, readFileSync } from 'node:fs';
import { join } from 'node:path';

import { LOCALE_FEATURES } from './constants';
import { englishTranslations, loadTranslations } from './i18n';
import { LOCALE_ICONS } from './localeIcons';

const directory = join(import.meta.dir, 'languages');
const files = readdirSync(directory);
const allKeys = Object.keys(englishTranslations).sort();

describe('language files', () => {
  it.each(files)('%s has exactly the keys of English', (file) => {
    expect(Object.keys(readLanguage(file)).sort()).toEqual(allKeys);
  });

  it.each(files)('%s has only non-empty strings', (file) => {
    const blankKeys = Object.entries(readLanguage(file))
      .filter(([, value]) => typeof value !== 'string' || value.trim().length === 0)
      .map(([key]) => key);

    expect(blankKeys).toEqual([]);
  });

  it.each(files)('%s has the placeholders of English', (file) => {
    const language = readLanguage(file);
    const mismatched = allKeys.filter((key) => {
      const english = englishTranslations[key as keyof typeof englishTranslations];

      return readPlaceholders(english).join() !== readPlaceholders(language[key]).join();
    });

    expect(mismatched).toEqual([]);
  });
});

describe('loadTranslations', () => {
  it.each(Object.values(Locale))('loads complete translations for %s', async (locale) => {
    const translations = await loadTranslations(locale);

    expect(Object.keys(translations).sort()).toEqual(allKeys);
  });

  it('serves English for both English locales', async () => {
    expect(await loadTranslations(Locale.EN_GB)).toBe(englishTranslations);
    expect(await loadTranslations(Locale.EN_US)).toBe(englishTranslations);
  });

  it('translates non-English locales', async () => {
    expect((await loadTranslations(Locale.PL_PL)).settings).not.toBe(englishTranslations.settings);
  });
});

describe('LOCALE_FEATURES', () => {
  it('covers every locale and each entry names its own locale', () => {
    expect(Object.keys(LOCALE_FEATURES).sort()).toEqual(Object.values(Locale).sort());

    for (const locale of Object.values(Locale)) {
      expect(LOCALE_FEATURES[locale].locale).toBe(locale);
    }
  });

  it.each(Object.values(Locale))('%s is complete', (locale) => {
    const { comma, direction, label, name, separator } = LOCALE_FEATURES[locale];

    expect(comma.length).toBe(1);
    expect(['ltr', 'rtl']).toContain(direction);
    expect(label.length).toBeGreaterThan(0);
    expect(name.length).toBeGreaterThan(0);
    expect(separator).toBe(`${comma} `);
  });

  it('marks Persian as the only right-to-left locale, with the Arabic comma', () => {
    const rtl = Object.values(LOCALE_FEATURES).filter(({ direction }) => direction === 'rtl');

    expect(rtl.map(({ locale }) => locale)).toEqual([Locale.FA_IR]);
    expect(rtl[0].comma).toBe('،');
    expect(rtl[0].consonants).toBe(false);
    expect(rtl[0].vowels).toBe(false);
  });

  it('gives every language a distinct label', () => {
    const labels = Object.values(LOCALE_FEATURES).map(({ label }) => label);

    expect(new Set(labels).size).toBe(labels.length);
  });
});

describe('LOCALE_ICONS', () => {
  it('has a flag for every locale', () => {
    expect(Object.keys(LOCALE_ICONS).sort()).toEqual(Object.values(Locale).sort());
    expect(new Set(Object.values(LOCALE_ICONS)).size).toBe(Object.values(Locale).length);
  });
});

describe('configs', () => {
  it('have a language for every locale, so every locale can be selected', () => {
    const locales = new Set(Object.values(languages).map(({ locale }) => locale));

    expect([...locales].sort()).toEqual(Object.values(Locale).sort());
    expect(Object.keys(games).length).toBeGreaterThan(0);
  });
});

function readPlaceholders(text: string): string[] {
  return Array.from(text.matchAll(/\{\{(\w+)\}\}/g), ([, name]) => name).sort();
}

function readLanguage(file: string): Record<string, string> {
  return JSON.parse(readFileSync(join(directory, file), 'utf8'));
}
