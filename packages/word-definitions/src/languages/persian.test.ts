import { describe, expect, it } from 'bun:test';

import { parse } from './persian';

describe('persian parse', () => {
  it('reads every definition in document order', () => {
    const html = `
      <div id="container">
        <h1>کتاب</h1>
        <div itemprop="articleBody">نوشته‌ای که صحافی شده است.</div>
        <div itemprop="articleBody">نامه.</div>
      </div>
    `;

    expect(parse(html)).toEqual({ definitions: ['نوشته‌ای که صحافی شده است.', 'نامه.'], exists: true });
  });

  it('reads the text of a definition without its markup', () => {
    const html = '<div itemprop="articleBody"><b>(کِ)</b> <span>نوشته</span> &amp; نامه</div>';

    expect(parse(html).definitions).toEqual(['(کِ) نوشته & نامه']);
  });

  it('ignores text outside of the article body', () => {
    const html = '<div id="container"><h1>کتاب</h1><p>تبلیغات</p></div>';

    expect(parse(html)).toEqual({ definitions: [], exists: true });
  });

  it('reports a missing word on the not-found page', () => {
    const html = '<div id="container"><h1>404 Page Not Found</h1></div>';

    expect(parse(html)).toEqual({ definitions: [], exists: false });
  });

  it('looks for the not-found message only in the page container', () => {
    expect(parse('<h1>404 Page Not Found</h1><div id="container"></div>').exists).toBe(true);
  });

  it('finds no definitions on an empty page', () => {
    expect(parse('').definitions).toEqual([]);
  });
});
