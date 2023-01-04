import { Locale } from '@scrabble-solver/types';
import fs from 'fs';
import path from 'path';

import parse from './parse';

export const readTestFile = (filepath: string): string => {
  const absoluteFilepath = path.resolve(__dirname, '__tests__', filepath);
  return fs.readFileSync(absoluteFilepath, 'utf-8');
};

const tests = [
  { locale: Locale.DE_DE, word: 'hm' },
  { locale: Locale.DE_DE, word: 'ho' },
  { locale: Locale.DE_DE, word: 'kolla' },
  { locale: Locale.DE_DE, word: 'vom' },
  { locale: Locale.EN_US, word: 'awe' },
  { locale: Locale.EN_US, word: 'pawn' },
  { locale: Locale.EN_US, word: 'pawnee' },
  { locale: Locale.EN_US, word: 'pean' },
  { locale: Locale.EN_US, word: 'wiz' },
  { locale: Locale.ES_ES, word: 'corma' },
  { locale: Locale.ES_ES, word: 'portero' },
];

describe('parse', () => {
  tests.forEach(({ locale, word }) => {
    it(`${locale} - "${word}"`, () => {
      const input = readTestFile(`input/${locale}.${word}.html`);
      const expected = readTestFile(`expected/${locale}.${word}.json`);
      expect(parse(locale, input)).toEqual(JSON.parse(expected));
    });
  });
});
