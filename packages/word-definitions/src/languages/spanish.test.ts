import { describe, expect, it } from 'bun:test';

import { parse } from './spanish';

describe('spanish parse', () => {
  it('reads every definition in document order', () => {
    const html = createResult(`
      <br><font class="verdBold13">1&nbsp;</font><font class="verdBoldItalic13">s. f. </font>&nbsp;<font class="gris13">Primera acepción.</font>
      <br><font class="verdBold13">2&nbsp;</font><font class="verdBoldItalic13">s. m. </font>&nbsp;<font class="gris13">Segunda acepción.</font>
    `);

    expect(parse(html)).toEqual({ definitions: ['Primera acepción.', 'Segunda acepción.'], exists: true });
  });

  it('ends a definition with a period', () => {
    expect(parse(createResult('<font class="gris13">Acepción</font>')).definitions).toEqual(['Acepción.']);
  });

  it('moves a period that is detached from the text', () => {
    expect(parse(createResult('<font class="gris13">Acepción  .</font>')).definitions).toEqual(['Acepción.']);
  });

  it('keeps one period on a definition that has it', () => {
    expect(parse(createResult('<font class="gris13">  Acepción.  </font>')).definitions).toEqual(['Acepción.']);
  });

  it('skips blank definitions', () => {
    const html = createResult('<font class="gris13">   </font><font class="gris13">Acepción.</font>');

    expect(parse(html).definitions).toEqual(['Acepción.']);
  });

  it('skips the text that follows a line break, which is the etymology', () => {
    const html = createResult('<br><font class="gris13">(Del lat. illa.)</font><font class="gris13">Acepción.</font>');

    expect(parse(html).definitions).toEqual(['Acepción.']);
  });

  it('skips the text that follows italics, which continues the etymology', () => {
    const html = createResult(`
      <font class="grisItalic13">qurma</font><font class="gris13">, leño.</font>
      <font class="gris13">Acepción.</font>
    `);

    expect(parse(html).definitions).toEqual(['Acepción.']);
  });

  it('skips the text of a usage note, which follows a heading and a label', () => {
    const html = createResult(`
      <font class="verdBold14">corma</font><font class="gris11">GRAMÁTICA</font><font class="gris13">Nota.</font>
      <font class="gris13">Acepción.</font>
    `);

    expect(parse(html).definitions).toEqual(['Acepción.']);
  });

  it.each([
    ['green', '<font class="verd13">literario</font>'],
    ['bold green', '<font class="verdBold13">1</font>'],
    ['small grey', '<font class="gris11">GRAMÁTICA</font>'],
    ['bold grey', '<font class="grisBold11">EJEMPLO:</font>'],
    ['italic grey', '<font class="grisItalic13">qurma</font>'],
  ])('removes %s labels nested in a definition', (_, label) => {
    const html = createResult(`<font class="gris13">Acepción ${label}</font>`);

    expect(parse(html).definitions).toEqual(['Acepción.']);
  });

  it('removes a definition nested in another one', () => {
    const html = createResult('<font class="gris13">Exterior <font class="gris13">interior</font></font>');

    expect(parse(html).definitions).toEqual(['Exterior.']);
  });

  it('ignores the definitions of the most searched words', () => {
    const html = `
      ${createResult('<font class="gris13">Acepción.</font>')}
      <div class="dcom-most-searched-result"><font class="gris13">Otra palabra.</font></div>
    `;

    expect(parse(html).definitions).toEqual(['Acepción.']);
  });

  it('reports a missing word on the not-found page', () => {
    const html = `
      <div class="wrapper"><p><strong>No se ha encontrado la palabra exacta</strong></p></div>
      <div class="dcom-search-result"></div>
    `;

    expect(parse(html)).toEqual({ definitions: [], exists: false });
  });

  it('ignores other messages in the same place', () => {
    const html = `<div class="wrapper"><p><strong>Otra cosa</strong></p></div>${createResult('')}`;

    expect(parse(html).exists).toBe(true);
  });

  it('finds no definitions on an empty page', () => {
    expect(parse('').definitions).toEqual([]);
  });
});

function createResult(content: string): string {
  return `<div class="wrapper"><div class="dcom-search-result">${content}</div></div>`;
}
