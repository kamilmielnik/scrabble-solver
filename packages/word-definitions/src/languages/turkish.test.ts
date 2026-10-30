import { describe, expect, it } from 'bun:test';

import { parse } from './turkish';

describe('turkish parse', () => {
  it('reads every meaning in order', () => {
    const json = JSON.stringify([
      { anlamlarListe: [{ anlam: 'Birinci anlam' }, { anlam: 'İkinci anlam' }], madde: 'kelime' },
    ]);

    expect(parse(json)).toEqual({ definitions: ['Birinci anlam', 'İkinci anlam'], exists: true });
  });

  it('removes the reference arrow and trims the meaning', () => {
    const json = JSON.stringify([{ anlamlarListe: [{ anlam: ' ► başka kelime ' }] }]);

    expect(parse(json).definitions).toEqual(['başka kelime']);
  });

  it('reports a missing word on the not-found payload', () => {
    expect(parse('{"error":"Sonuç bulunamadı"}')).toEqual({ definitions: [], exists: false });
  });

  it.each([
    ['an object without an error', '{"madde":"kelime"}'],
    ['null', 'null'],
    ['a number', '42'],
    ['a text', '"kelime"'],
  ])('reports a missing word for %s', (_, json) => {
    expect(parse(json)).toEqual({ definitions: [], exists: false });
  });

  it('reports a missing word for an entry with an empty list of meanings', () => {
    expect(parse('[{"anlamlarListe":[]}]')).toEqual({ definitions: [], exists: false });
  });

  it.todo('reads the meanings of every entry when a word has many homonyms');

  it.todo('reports a missing word when the response is not JSON, such as an empty body or an html error page');

  it.todo('reports a missing word for an empty array');

  it.todo('reports a missing word for an entry without a list of meanings');
});
