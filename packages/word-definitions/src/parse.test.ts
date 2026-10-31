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

  describe('dispatch', () => {
    it.each([
      {
        input: '<div class="bedeutungsuebersicht"><ol><li><a href="#1">Bedeutung</a></li></ol></div>',
        locale: Locale.DE_DE,
        expected: 'Bedeutung',
      },
      { input: createEnglishPayload('meaning'), locale: Locale.EN_GB, expected: 'meaning' },
      { input: createEnglishPayload('meaning'), locale: Locale.EN_US, expected: 'meaning' },
      {
        input: '<div class="dcom-search-result"><font class="gris13">Acepción.</font></div>',
        locale: Locale.ES_ES,
        expected: 'Acepción.',
      },
      { input: '<div itemprop="articleBody">نوشته</div>', locale: Locale.FA_IR, expected: 'نوشته' },
      { input: '<div class="tlf_cdefinition">Félin.</div>', locale: Locale.FR_FR, expected: 'Félin.' },
      { input: '<h1>kot</h1><p></p><p></p><p></p><p>zwierzę</p>', locale: Locale.PL_PL, expected: 'zwierzę' },
      {
        input: `
          <div class="tab-pane show active">
            <ul><li class="type-meaning depth-0">
              <div class="meaningContainer"><span class="tree-def html">Sens.</span></div>
            </li></ul>
          </div>
        `,
        locale: Locale.RO_RO,
        expected: 'Sens.',
      },
      { input: '[{"anlamlarListe":[{"anlam":"Anlam"}]}]', locale: Locale.TR_TR, expected: 'Anlam' },
    ])('[$locale] uses the parser of its source', ({ expected, input, locale }) => {
      expect(parse(locale, input).definitions).toEqual([expected]);
    });

    it.each(['awe', 'oe', 'pawn', 'pawnee', 'pean', 'wiz', 'zzzzqq'])(
      'reads "%s" the same way in en-GB and en-US',
      (word) => {
        const input = readTestFile(`input/${Locale.EN_US}.${word}.json`);

        expect(parse(Locale.EN_GB, input)).toEqual(parse(Locale.EN_US, input));
      },
    );
  });

  describe('definitions', () => {
    it('removes the definitions that are blank after normalization', () => {
      const input = createFrenchEntry('Félin.', '   ', '...', ':', 'Rusé.');

      expect(parse(Locale.FR_FR, input).definitions).toEqual(['Félin.', 'Rusé.']);
    });

    it('preserves the order of the source', () => {
      const input = createFrenchEntry('zebra', 'apple', 'mango');

      expect(parse(Locale.FR_FR, input).definitions).toEqual(['zebra', 'apple', 'mango']);
    });

    it('normalizes each definition', () => {
      const input = createEnglishPayload('(1.2) a\tword , and more:');

      expect(parse(Locale.EN_US, input).definitions).toEqual(['a word, and more']);
    });

    it('removes exact duplicates and keeps the first one in place', () => {
      const input = createFrenchEntry('Félin.', 'Rusé.', 'Félin.', 'Ami.');

      expect(parse(Locale.FR_FR, input).definitions).toEqual(['Félin.', 'Rusé.', 'Ami.']);
    });

    it('removes the definitions that become duplicates only after normalization', () => {
      const input = createFrenchEntry('Félin', '  Félin:  ', ': Félin', 'Félin\t,');

      expect(parse(Locale.FR_FR, input).definitions).toEqual(['Félin']);
    });

    it('keeps the definitions that differ by case', () => {
      expect(parse(Locale.FR_FR, createFrenchEntry('félin', 'Félin')).definitions).toEqual(['félin', 'Félin']);
    });
  });

  describe('exists', () => {
    it('stays true when every definition of an entry is blank after normalization', () => {
      expect(parse(Locale.FR_FR, createFrenchEntry('...', '   '))).toEqual({ definitions: [], exists: true });
    });

    it('stays false on a page that has definitions but no entry', () => {
      const input = '<div class="tlf_cdefinition">Félin.</div>';

      expect(parse(Locale.FR_FR, input)).toEqual({ definitions: ['Félin.'], exists: false });
    });
  });
});

function createEnglishPayload(definition: string): string {
  return JSON.stringify({ en: [{ definitions: [{ definition }] }] });
}

function createFrenchEntry(...definitions: string[]): string {
  const items = definitions.map((definition) => `<div class="tlf_cdefinition">${definition}</div>`).join('');

  return `<li id="vitemselected"><span>MOT</span></li>${items}`;
}
