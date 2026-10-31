import { Locale } from '@scrabble-solver/types';
import { describe, expect, it } from 'bun:test';
import os from 'os';
import path from 'path';

import { getDictionaryFilepath } from './getDictionaryFilepath';

describe('getDictionaryFilepath', () => {
  it('points into the output directory by default', () => {
    const outputDirectory = path.join(os.homedir(), '.scrabble-solver', 'dictionaries');

    expect(getDictionaryFilepath(Locale.EN_US)).toBe(path.join(outputDirectory, 'en-US.gaddag'));
  });

  it('points into a given directory', () => {
    expect(getDictionaryFilepath(Locale.FA_IR, '/some/directory')).toBe('/some/directory/fa-IR.gaddag');
  });

  it('resolves a relative directory to an absolute path', () => {
    expect(getDictionaryFilepath(Locale.PL_PL, 'relative')).toBe(path.resolve('relative', 'pl-PL.gaddag'));
  });

  it('gives every locale its own file', () => {
    const locales = Object.values(Locale);
    const filepaths = locales.map((locale) => getDictionaryFilepath(locale));

    expect(new Set(filepaths).size).toBe(locales.length);
  });
});
