import { describe, expect, it } from 'bun:test';

import { parse } from './english';

describe('english parse', () => {
  it('reads every definition of every part of speech, in payload order', () => {
    const json = createPayload(['noun one', 'noun two'], ['verb one'], ['adjective one']);

    expect(parse(json)).toEqual({
      definitions: ['noun one', 'noun two', 'verb one', 'adjective one'],
      exists: true,
    });
  });

  it('strips the html inside a definition', () => {
    const json = createPayload([
      '<span class="usage-label-sense"><a href="/wiki/rare">rare</a></span> a <b>bold</b> word',
    ]);

    expect(parse(json).definitions).toEqual(['rare a bold word']);
  });

  it('decodes html entities', () => {
    expect(parse(createPayload(['fish &amp; chips &#8212; food'])).definitions).toEqual(['fish & chips — food']);
  });

  it('trims a definition', () => {
    expect(parse(createPayload(['  word  \n'])).definitions).toEqual(['word']);
  });

  it('skips blank definitions, also when only markup makes them look filled', () => {
    expect(parse(createPayload(['', '   ', '<span></span>', 'word']))).toEqual({
      definitions: ['word'],
      exists: true,
    });
  });

  it('treats a payload with nothing but blank definitions as a missing word', () => {
    expect(parse(createPayload(['', '<span> </span>']))).toEqual({ definitions: [], exists: false });
  });

  it('skips a part of speech that has no definitions', () => {
    const json = JSON.stringify({
      en: [{ partOfSpeech: 'Noun' }, { definitions: [], partOfSpeech: 'Verb' }, ...createUsages(['word'])],
    });

    expect(parse(json)).toEqual({ definitions: ['word'], exists: true });
  });

  it('reads the English section only', () => {
    const json = JSON.stringify({ de: createUsages(['Wort']), en: createUsages(['word']) });

    expect(parse(json).definitions).toEqual(['word']);
  });

  it('treats a word defined in other languages only as a missing word', () => {
    expect(parse(JSON.stringify({ de: createUsages(['Wort']) }))).toEqual({ definitions: [], exists: false });
  });

  it.each([
    ['the not-found payload', '{"status":404,"type":"Internal error"}'],
    ['an empty English section', '{"en":[]}'],
    ['a null English section', '{"en":null}'],
    ['a text English section', '{"en":"word"}'],
    ['an object English section', '{"en":{}}'],
    ['an empty object', '{}'],
    ['an empty array', '[]'],
    ['null', 'null'],
    ['a number', '42'],
    ['a text', '"word"'],
    ['an empty body', ''],
    ['an html error page', '<html><body>Service unavailable</body></html>'],
    ['truncated json', '{"en":[{"definitions":[{"definition":"wo'],
  ])('treats %s as a missing word', (_, json) => {
    expect(parse(json)).toEqual({ definitions: [], exists: false });
  });
});

function createPayload(...usages: string[][]): string {
  return JSON.stringify({ en: usages.flatMap(createUsages) });
}

function createUsages(definitions: string[]) {
  return [
    { definitions: definitions.map((definition) => ({ definition })), language: 'English', partOfSpeech: 'Noun' },
  ];
}
