import { describe, expect, it } from 'bun:test';

import { parse } from './french';

const SELECTED_ENTRY =
  '<ul id="vtoolbar"><li id="vitemselected"><a href="/definition/chat"><span>CHAT</span></a></li></ul>';

describe('french parse', () => {
  it('reads every definition in document order', () => {
    const html = `
      ${SELECTED_ENTRY}
      <div id="lexicontent">
        <div class="tlf_cdefinition">Petit félin.</div>
        <div class="tlf_cplan">Autre section</div>
        <div class="tlf_cdefinition">Personne rusée.</div>
      </div>
    `;

    expect(parse(html)).toEqual({ definitions: ['Petit félin.', 'Personne rusée.'], exists: true });
  });

  it('reads the text of a definition without its markup', () => {
    const html = `${SELECTED_ENTRY}<div class="tlf_cdefinition">Petit <span class="tlf_csyntagme"><i>félin</i></span> &amp; ami.</div>`;

    expect(parse(html).definitions).toEqual(['Petit félin & ami.']);
  });

  it('reports an entry even when it has no definitions', () => {
    expect(parse(SELECTED_ENTRY)).toEqual({ definitions: [], exists: true });
  });

  it('reports a missing word on the not-found page', () => {
    const html = '<div id="contentbox"><div id="lexicontent">Cette forme est introuvable !</div></div>';

    expect(parse(html)).toEqual({ definitions: [], exists: false });
  });

  it('reports a missing word when the selected item has no label', () => {
    expect(parse('<li id="vitemselected"></li>').exists).toBe(false);
  });

  it('reports a missing word for an empty page', () => {
    expect(parse('')).toEqual({ definitions: [], exists: false });
  });
});
