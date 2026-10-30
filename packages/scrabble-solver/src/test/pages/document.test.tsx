/* eslint-disable @typescript-eslint/no-unsafe-argument */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */

import { afterEach, beforeEach, describe, expect, it, spyOn } from 'bun:test';
import fs from 'fs';
import { Head } from 'next/document';
import { type ReactElement, type ReactNode, isValidElement } from 'react';

import MyDocument from '../../pages/_document';
import { CONFIG_PENDING_CLASS } from '../../parameters';

const root = document.documentElement;
const tree = MyDocument.prototype.render.call({}) as ReactElement<{ children: ReactNode; dir: string; lang: string }>;
const head = findElement(tree, (element) => element.type !== 'body' && 'getCssLinks' in Object(element.type).prototype);
const script = findElement(tree, (element) => element.type === 'script');
const preHydrationScript = (script!.props as { dangerouslySetInnerHTML: { __html: string } }).dangerouslySetInnerHTML
  .__html;

beforeEach(() => {
  root.removeAttribute('style');
  root.removeAttribute('class');
  root.removeAttribute('dir');
  root.removeAttribute('lang');
});

afterEach(() => {
  root.removeAttribute('style');
  root.removeAttribute('class');
});

describe('document', () => {
  it('starts as the left-to-right default locale, matching the server render', () => {
    expect(tree.props.dir).toBe('ltr');
    expect(tree.props.lang).toBe('en-US');
  });
});

describe('pre-paint script', () => {
  it('does nothing for a first-time visitor', () => {
    runScript();

    expect(root.getAttribute('style')).toBeNull();
    expect(root.dir).toBe('');
  });

  it.each(['not json', '{', '"text"', '1'])('survives the corrupt entry %s', (stored) => {
    window.localStorage.setItem('scrabble-solver.settings', stored);

    expect(runScript).not.toThrow();
    expect(root.classList.contains(CONFIG_PENDING_CLASS)).toBe(false);
  });

  it('applies the board and rack dimensions of the persisted game', () => {
    persist({ game: 'super-scrabble' });

    runScript();

    expect(root.style.getPropertyValue('--board-cols')).toBe('21');
    expect(root.style.getPropertyValue('--board-rows')).toBe('21');
    expect(root.style.getPropertyValue('--rack-size')).toBe('7');
  });

  it('holds main hidden for a game other than the rendered default', () => {
    persist({ game: 'super-scrabble' });

    runScript();

    expect(root.classList.contains(CONFIG_PENDING_CLASS)).toBe(true);
  });

  it('does not hide anything for the default game', () => {
    persist({ game: 'scrabble' });

    runScript();

    expect(root.classList.contains(CONFIG_PENDING_CLASS)).toBe(false);
  });

  it('ignores an unknown game', () => {
    persist({ game: 'chess' });

    runScript();

    expect(root.getAttribute('style')).toBeNull();
    expect(root.classList.contains(CONFIG_PENDING_CLASS)).toBe(false);
  });

  it('applies direction and language of the persisted locale', () => {
    persist({ locale: 'fa-IR' });

    runScript();

    expect(root.dir).toBe('rtl');
    expect(root.lang).toBe('fa-IR');
  });

  it('ignores an unknown locale', () => {
    persist({ locale: 'xx-XX' });

    runScript();

    expect(root.dir).toBe('');
    expect(root.lang).toBe('');
  });
});

describe('inline CSS head', () => {
  const HeadClass = head!.type as unknown as new (props: object) => { getCssLinks: (files: object) => unknown };

  it('inlines every stylesheet so no request blocks rendering', () => {
    const readFile = spyOn(fs, 'readFileSync').mockImplementation((() => '.a{}') as never);
    const links = new HeadClass({}).getCssLinks({ allFiles: ['static/a.css', 'static/b.js'] }) as ReactElement<{
      dangerouslySetInnerHTML: { __html: string };
      'data-href': string;
    }>[];

    expect(links).toHaveLength(1);
    expect(links[0].type).toBe('style');
    expect(links[0].props.dangerouslySetInnerHTML.__html).toBe('.a{}');
    expect(links[0].props['data-href']).toBe('/_next/static/a.css');
    readFile.mockRestore();
  });

  it('falls back to the default links when a stylesheet cannot be read', () => {
    const readFile = spyOn(fs, 'readFileSync').mockImplementation((() => {
      throw new Error('missing');
    }) as never);
    const fallback = spyOn(Head.prototype, 'getCssLinks').mockImplementation((() => 'default links') as never);

    expect(new HeadClass({}).getCssLinks({ allFiles: ['static/a.css'] })).toBe('default links');
    readFile.mockRestore();
    fallback.mockRestore();
  });
});

function persist(settings: object): void {
  window.localStorage.setItem('scrabble-solver.settings', JSON.stringify(settings));
}

function runScript(): void {
  // oxlint-disable-next-line no-new-func, typescript/no-implied-eval
  new Function(preHydrationScript)();
}

function findElement(node: ReactNode, predicate: (element: ReactElement) => boolean): ReactElement | undefined {
  if (Array.isArray(node)) {
    for (const child of node) {
      const found = findElement(child, predicate);

      if (found) {
        return found;
      }
    }

    return undefined;
  }

  if (!isValidElement(node)) {
    return undefined;
  }

  if (predicate(node)) {
    return node;
  }

  return findElement((node.props as { children?: ReactNode }).children, predicate);
}
