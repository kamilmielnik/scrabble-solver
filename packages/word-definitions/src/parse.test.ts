import { Locale } from '@scrabble-solver/types';
import fs from 'fs';
import path from 'path';

import { parse } from './parse';
import { type ParsingResult } from './types';

const readTestFile = (filepath: string): string => {
  const absoluteFilepath = path.resolve(__dirname, '__tests__', filepath);
  return fs.readFileSync(absoluteFilepath, 'utf-8');
};

const readExpected = (filepath: string): ParsingResult => {
  return JSON.parse(readTestFile(filepath));
};

const tests = [
  { locale: Locale.DE_DE, word: 'hm' },
  { locale: Locale.DE_DE, word: 'ho' },
  { locale: Locale.DE_DE, word: 'kolla' },
  { locale: Locale.DE_DE, word: 'vom' },
  { extension: 'json', locale: Locale.EN_US, word: 'awe' },
  { extension: 'json', locale: Locale.EN_US, word: 'oe' },
  { extension: 'json', locale: Locale.EN_US, word: 'pawn' },
  { extension: 'json', locale: Locale.EN_US, word: 'pawnee' },
  { extension: 'json', locale: Locale.EN_US, word: 'pean' },
  { extension: 'json', locale: Locale.EN_US, word: 'wiz' },
  { extension: 'json', locale: Locale.EN_US, word: 'zzzzqq' },
  { locale: Locale.ES_ES, word: 'corma' },
  { locale: Locale.ES_ES, word: 'portero' },
  { locale: Locale.RO_RO, word: 'aciua' },
  { locale: Locale.TR_TR, word: 'lojik' },
];

describe('parse', () => {
  it.each(tests)(`[$locale] "$word"`, ({ extension = 'html', locale, word }) => {
    const input = readTestFile(`input/${locale}.${word}.${extension}`);
    const expected = readExpected(`expected/${locale}.${word}.json`);
    expect(parse(locale, input)).toEqual(expected);
  });
});
