import { describe, expect, it } from 'bun:test';

import { parse } from './german';

describe('german parse', () => {
  describe('meaning overview', () => {
    it('reads each list item and drops its leading number', () => {
      const html = createOverview(
        '<li>1. <a href="#1">erste Bedeutung</a></li><li>2. <a href="#2">zweite Bedeutung</a></li>',
      );

      expect(parse(html)).toEqual({ definitions: ['erste Bedeutung', 'zweite Bedeutung'], exists: true });
    });

    it('keeps the label in front of the link', () => {
      const html = createOverview('<li>[<span>umgangssprachlich</span>] <a href="#1">Bedeutung</a></li>');

      expect(parse(html).definitions).toEqual(['[umgangssprachlich] Bedeutung']);
    });

    it('puts each sub-meaning on its own line under its parent', () => {
      const html = createOverview(
        '<li>[<span>umgangssprachlich</span>] <a href="#1">...</a><ol style="list-style-type:none">' +
          '<li>1. <a href="#1-1">erste</a></li><li>2. <a href="#1-2">zweite</a></li></ol></li>',
      );

      expect(parse(html).definitions).toEqual(['[umgangssprachlich] ...\n1. erste\n2. zweite']);
    });

    it('removes the line breaks inside a link', () => {
      expect(parse(createOverview('<li><a href="#1">erste\nBedeutung</a></li>')).definitions).toEqual([
        'ersteBedeutung',
      ]);
    });

    it('collapses repeated spaces and drops the spaces in front of a line break', () => {
      const html = createOverview('<li>a    b \nc</li>');

      expect(parse(html).definitions).toEqual(['a b\nc']);
    });

    it('takes precedence over the detailed meanings', () => {
      const html = `
        ${createOverview('<li><a href="#1">aus der Übersicht</a></li>')}
        <div class="dwdswb-lesart"><span class="dwdswb-definition">aus dem Artikel</span></div>
      `;

      expect(parse(html).definitions).toEqual(['aus der Übersicht']);
    });

    it('keeps a sub-list that has no link in front of it', () => {
      const html = createOverview('<li>Oberbegriff<ol><li>Unterbegriff</li></ol></li>');

      expect(parse(html).definitions.join(' ')).toContain('Unterbegriff');
    });
  });

  describe('detailed meanings', () => {
    it('reads the definitions when the overview is missing', () => {
      const html = `
        <div class="dwdswb-lesart"><span class="dwdswb-definition">1. erste</span></div>
        <div class="dwdswb-lesart"><span class="dwdswb-definition">zweite</span></div>
      `;

      expect(parse(html).definitions).toEqual(['erste', 'zweite']);
    });

    it('reads the definitions when the overview has no items', () => {
      const html = `
        <div class="bedeutungsuebersicht"><ol></ol></div>
        <div class="dwdswb-lesart"><span class="dwdswb-definition">erste</span></div>
      `;

      expect(parse(html).definitions).toEqual(['erste']);
    });

    it('ignores a definition outside of a meaning', () => {
      expect(parse('<span class="dwdswb-definition">erste</span>').definitions).toEqual([]);
    });

    it('prefers definitions over specifications', () => {
      const html = `
        <div class="dwdswb-lesart">
          <span class="dwdswb-definition">Definition</span>
          <span class="dwdswb-definition-spezifizierung">Spezifizierung</span>
        </div>
      `;

      expect(parse(html).definitions).toEqual(['Definition']);
    });

    it('falls back to specifications when nothing else is available', () => {
      const html =
        '<div class="dwdswb-lesart"><span class="dwdswb-definition-spezifizierung">drückt Überraschung aus</span></div>';

      expect(parse(html).definitions).toEqual(['drückt Überraschung aus']);
    });
  });

  describe('references', () => {
    it('reads the referenced meanings from the tooltip content', () => {
      const html = `<div class="dwdswb-lesart">${createReference('<span>erste</span>')}${createReference('<span>zweite</span>')}</div>`;

      expect(parse(html).definitions).toEqual(['erste', 'zweite']);
    });

    it('splits a tooltip at semicolons and trims the parts', () => {
      const html = `<div class="dwdswb-lesart">${createReference('<span>erste ;  zweite;dritte</span>')}</div>`;

      expect(parse(html).definitions).toEqual(['erste', 'zweite', 'dritte']);
    });

    it('prefers definitions over references', () => {
      const html = `
        <div class="dwdswb-lesart">
          <span class="dwdswb-definition">Definition</span>
          ${createReference('<span>Verweis</span>')}
        </div>
      `;

      expect(parse(html).definitions).toEqual(['Definition']);
    });

    it('reads a blank definition from a reference without tooltip content', () => {
      expect(parse('<div class="dwdswb-lesart"><a class="dwdswb-verweis"></a></div>').definitions).toEqual(['']);
    });
  });

  describe('exists', () => {
    it('reports a missing word when a danger label says "Hinweis"', () => {
      const html = '<span class="label label-danger">Hinweis</span> Es wurde kein Eintrag gefunden.';

      expect(parse(html)).toEqual({ definitions: [], exists: false });
    });

    it('checks every danger label', () => {
      const html = '<span class="label-danger">Sonstiges</span><span class="label-danger">Hinweis</span>';

      expect(parse(html).exists).toBe(false);
    });

    it('ignores other danger labels', () => {
      const html = `<span class="label-danger">Sonstiges</span>${createOverview('<li><a href="#1">Bedeutung</a></li>')}`;

      expect(parse(html).exists).toBe(true);
    });

    it('ignores a "Hinweis" outside of a danger label', () => {
      const html = `<span class="label-info">Hinweis</span>${createOverview('<li><a href="#1">Bedeutung</a></li>')}`;

      expect(parse(html).exists).toBe(true);
    });

    it('reports an entry even when it has no definitions', () => {
      const html = '<h1 class="dwdswb-ft-lemmaansatz">Wort</h1>';

      expect(parse(html)).toEqual({ definitions: [], exists: true });
    });
  });

  it('finds no definitions on an empty page', () => {
    expect(parse('').definitions).toEqual([]);
  });
});

function createOverview(items: string): string {
  return `<div class="bedeutungsuebersicht"><h2>Bedeutungsübersicht</h2><ol>${items}</ol></div>`;
}

function createReference(content: string): string {
  return `<a class="dwdswb-verweis" data-content="${content}"></a>`;
}
