import { describe, expect, it } from 'bun:test';

import { parse } from './catalan';

describe('catalan parse', () => {
  it('reads the definitions of every part of speech', () => {
    const html = createPage(
      createSection('Català', createDefinitions('Primer sentit.'), createDefinitions('Segon sentit.')),
    );

    expect(parse(html)).toEqual({ definitions: ['Primer sentit.', 'Segon sentit.'], exists: true });
  });

  it('reads only the Catalan section', () => {
    const html = createPage(
      createSection('Anglès', createDefinitions('Other language.')),
      createSection('Català', createDefinitions('Sentit.')),
    );

    expect(parse(html).definitions).toEqual(['Sentit.']);
  });

  it('reads the Catalan sections of every page', () => {
    const html = `${createPage(createSection('Català', createDefinitions('Cafe.')))}\n${createPage(createSection('Català', createDefinitions('Cafè.')))}`;

    expect(parse(html).definitions).toEqual(['Cafe.', 'Cafè.']);
  });

  it('survives a not-found payload next to a page', () => {
    const html = `{"type":"MediaWikiError/Not_Found"}\n${createPage(createSection('Català', createDefinitions('Sentit.')))}`;

    expect(parse(html).definitions).toEqual(['Sentit.']);
  });

  it('skips examples', () => {
    const html = createPage(createSection('Català', createDefinitions('Sentit.<dl><dd><i>Exemple.</i></dd></dl>')));

    expect(parse(html).definitions).toEqual(['Sentit.']);
  });

  it('skips nested lists', () => {
    const html = createPage(createSection('Català', createDefinitions('Sentit.<ol><li>Subsentit.</li></ol>')));

    expect(parse(html).definitions).toEqual(['Sentit.']);
  });

  it('skips metadata that has no text to show', () => {
    const html = createPage(
      createSection(
        'Català',
        createDefinitions('(<link href="./Categoria:Física"/>física) Sentit.<style>.a{}</style>'),
      ),
    );

    expect(parse(html).definitions).toEqual(['(física) Sentit.']);
  });

  it('skips lists outside of an ordered list of definitions', () => {
    const html = createPage(createSection('Català', '<ul><li>Vegeu també.</li></ul>'));

    expect(parse(html)).toEqual({ definitions: [], exists: false });
  });

  it('finds nothing on a page without a Catalan section', () => {
    expect(parse(createPage(createSection('Anglès', createDefinitions('Word.'))))).toEqual({
      definitions: [],
      exists: false,
    });
  });

  it('finds nothing in a not-found payload', () => {
    expect(parse('{"type":"MediaWikiError/Not_Found"}')).toEqual({ definitions: [], exists: false });
  });
});

function createPage(...sections: string[]): string {
  return `<!DOCTYPE html><html><head><title>t</title></head><body>${sections.join('')}</body></html>`;
}

function createSection(language: string, ...content: string[]): string {
  return `<section><h2 id="${language}">${language}</h2>${content.join('')}</section>`;
}

function createDefinitions(...definitions: string[]): string {
  const items = definitions.map((definition) => `<li>${definition}</li>`).join('');

  return `<section><h3 id="Nom">Nom</h3><ol>${items}</ol></section>`;
}
