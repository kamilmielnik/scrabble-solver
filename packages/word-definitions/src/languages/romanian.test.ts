import { describe, expect, it } from 'bun:test';

import { parse } from './romanian';

describe('romanian parse', () => {
  it('reads the top-level meanings in document order', () => {
    const html = createTab('show active', createMeaning(0, 'Primul sens.'), createMeaning(0, 'Al doilea sens.'));

    expect(parse(html)).toEqual({ definitions: ['Primul sens.', 'Al doilea sens.'], exists: true });
  });

  it('reads only the active tab', () => {
    const html = `${createTab('', createMeaning(0, 'Din altă filă.'))}${createTab('show active', createMeaning(0, 'Din fila activă.'))}`;

    expect(parse(html).definitions).toEqual(['Din fila activă.']);
  });

  it('skips nested meanings', () => {
    const html = createTab('show active', createMeaning(0, 'Sens.', createMeaning(1, 'Subsens.')));

    expect(parse(html).definitions).toEqual(['Sens.']);
  });

  it('skips a meaning tree nested in a definition', () => {
    const definition = `Sens.<ul class="meaningTree"><li>Subsens.</li></ul>`;

    expect(parse(createTab('show active', createMeaning(0, definition))).definitions).toEqual(['Sens.']);
  });

  it('skips examples, including those placed inside a definition', () => {
    const definition = 'Sens.<span class="type-example">Exemplu.</span>';
    const example =
      '<li class="type-example depth-0"><div class="meaningContainer"><span class="tree-def html">Exemplu.</span></div></li>';

    expect(parse(createTab('show active', createMeaning(0, definition), example)).definitions).toEqual(['Sens.']);
  });

  it('skips a list item that is not a meaning', () => {
    const synonym =
      '<li class="type-synonym depth-0"><div class="meaningContainer"><span class="tree-def html">Sinonim.</span></div></li>';

    expect(parse(createTab('show active', synonym))).toEqual({ definitions: [], exists: false });
  });

  it('removes line breaks without adding spaces, and drops the markup', () => {
    const html = createTab('show active', createMeaning(0, 'Primul\n<i>sens</i>\n.'));

    expect(parse(html).definitions).toEqual(['Primulsens.']);
  });

  it('reports a missing word when the active tab has no meanings', () => {
    expect(parse(createTab('show active'))).toEqual({ definitions: [], exists: false });
  });

  it('reports a missing word when only an inactive tab has meanings', () => {
    expect(parse(createTab('', createMeaning(0, 'Sens.')))).toEqual({ definitions: [], exists: false });
  });

  it('reports a missing word for an empty page', () => {
    expect(parse('')).toEqual({ definitions: [], exists: false });
  });
});

function createTab(state: string, ...meanings: string[]): string {
  return `<div class="tab-pane ${state}"><ul class="meaningTree">${meanings.join('')}</ul></div>`;
}

function createMeaning(depth: number, definition: string, nestedMeanings = ''): string {
  return `
    <li class="type-meaning depth-${depth}">
      <div class="meaningContainer"><div class="meaning-row"><span class="tree-def html">${definition}</span></div></div>
      <ul class="meaningTree">${nestedMeanings}</ul>
    </li>
  `;
}
