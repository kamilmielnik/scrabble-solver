import { Locale } from '@scrabble-solver/types';
import { describe, expect, it } from 'bun:test';

import { parse } from '../parse';

import { parse as parsePolish } from './polish';

const ALLOWED = 'dopuszczalne w grach (i)';
const NOT_ALLOWED = 'niedopuszczalne w grach (i)';

describe('polish parse', () => {
  it('splits a numbered entry into definitions, in order', () => {
    const html = createEntry(ALLOWED, '1. zwierzę domowe;<br>2. pot. kierowca pasażer;<br>10. coś innego');

    expect(parse(Locale.PL_PL, html)).toEqual({
      definitions: ['zwierzę domowe;', 'pot. kierowca pasażer;', 'coś innego'],
      exists: true,
    });
  });

  it('reads an entry without numbers as one definition', () => {
    expect(parse(Locale.PL_PL, createEntry(ALLOWED, 'zwierzę domowe')).definitions).toEqual(['zwierzę domowe']);
  });

  it('reads the definitions from their fixed position after the header', () => {
    const html = '<h1>kot</h1><p>dopuszczalne w grach</p><p>kocie</p><p>KOT</p><p>zwierzę</p><p>stopka</p>';

    expect(parse(Locale.PL_PL, html).definitions).toEqual(['zwierzę']);
  });

  it('ignores everything in front of the first header', () => {
    const html = `<p>1. reklama</p>${createEntry(ALLOWED, 'zwierzę')}`;

    expect(parse(Locale.PL_PL, html).definitions).toEqual(['zwierzę']);
  });

  it('reports an entry that is allowed in games', () => {
    expect(parsePolish(createEntry(ALLOWED, 'zwierzę')).exists).toBe(true);
  });

  it('reports an entry that is not allowed in games, since it is still in the dictionary', () => {
    expect(parsePolish(createEntry(NOT_ALLOWED, 'zwierzę')).exists).toBe(true);
  });

  it('finds the allowance note with whitespace around it', () => {
    expect(parsePolish(createEntry(`\n  ${ALLOWED}\n`, 'zwierzę')).exists).toBe(true);
  });

  it('reports a missing word on the not-found page', () => {
    const html = '<h1>xyzzy</h1><p>nie występuje w słowniku</p>';

    expect(parse(Locale.PL_PL, html)).toEqual({ definitions: [], exists: false });
  });

  it('reports a missing word for a page without a header', () => {
    expect(parse(Locale.PL_PL, '<p>dopuszczalne w grach</p>')).toEqual({ definitions: [], exists: false });
  });

  it('reports a missing word for an empty page', () => {
    expect(parse(Locale.PL_PL, '')).toEqual({ definitions: [], exists: false });
  });

  it.todo('keeps a decimal number inside a definition, such as "miara 2.5 litra"');
});

function createEntry(allowance: string, definitions: string): string {
  return `<h1><a href="/kot">kot</a></h1><p>${allowance}</p><p>kocie, kocia</p><p>KOT</p><p>${definitions}</p>`;
}
