import { Locale } from '@scrabble-solver/types';
import fs from 'fs';
import path from 'path';

import parse from './parse';

export const readTestFile = (filepath: string): string => {
  const absoluteFilepath = path.resolve(__dirname, '__tests__', filepath);
  return fs.readFileSync(absoluteFilepath, 'utf-8');
};

const tests = [{ locale: Locale.EN_US, word: 'wiz' }];

describe('parse', () => {
  tests.forEach(({ locale, word }) => {
    it(`${locale} - "${word}"`, () => {
      const input = readTestFile(`input/${locale}.${word}.html`);
      const expected = readTestFile(`expected/${locale}.${word}.json`);
      expect(parse(locale, input)).toEqual(JSON.parse(expected));
    });
  });
});
