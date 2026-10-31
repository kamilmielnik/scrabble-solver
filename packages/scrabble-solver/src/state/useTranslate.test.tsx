/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */

import { Locale } from '@scrabble-solver/types';

import { englishTranslations } from '../i18n/i18n';
import { renderHookWithStore } from '../test/render';
import { type TranslationKey, type Translations } from '../types';

import { i18nInitialState } from './i18n';
import { settingsInitialState } from './settings';
import { useTranslate } from './useTranslate';

describe('useTranslate', () => {
  it('reads the active language', () => {
    const { result } = setup();

    expect(result.current('menu')).toBe(englishTranslations.menu);
  });

  it('replaces every occurrence of a placeholder', () => {
    const { result } = setup({ menu: '{{a}} and {{a}}' });

    expect(result.current('menu', { a: 'x' })).toBe('x and x');
  });

  it('replaces several placeholders', () => {
    const { result } = setup({ menu: '{{a}} {{b}}' });

    expect(result.current('menu', { a: '1', b: '2' })).toBe('1 2');
  });

  it('leaves unknown placeholders in place', () => {
    const { result } = setup({ menu: '{{a}}' });

    expect(result.current('menu', { b: 'x' })).toBe('{{a}}');
  });

  it('throws for a key with no translation, naming the key and locale', () => {
    const { result } = setup();

    expect(() => result.current('nope' as TranslationKey)).toThrow('Untranslated key "nope" in locale "pl-PL"');
  });
});

function setup(overrides: Partial<Translations> = {}) {
  return renderHookWithStore(() => useTranslate(), {
    state: {
      i18n: {
        ...i18nInitialState,
        translations: { [Locale.PL_PL]: { ...englishTranslations, ...overrides, nope: undefined } as Translations },
      },
      settings: { ...settingsInitialState, locale: Locale.PL_PL },
    },
  });
}
