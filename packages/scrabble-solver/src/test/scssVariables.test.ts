import { readFileSync } from 'node:fs';
import { join } from 'node:path';

import { BREAKPOINTS, COLOR_BACKGROUND, RESULTS_ITEM_HEIGHT, TOOLTIP_DURATION } from '../parameters';

import { scssVariables } from './scssVariables';

const tokens = readFileSync(join(import.meta.dir, '../styles/_tokens.scss'), 'utf8');
const exports = readFileSync(join(import.meta.dir, '../styles/variables.module.scss'), 'utf8');

describe('scssVariables', () => {
  it('declares every key that variables.module.scss exports', () => {
    const exportedKeys = Array.from(exports.matchAll(/^\s+(\w+): /gm), ([, key]) => key).sort();

    expect(Object.keys(scssVariables).sort()).toEqual(exportedKeys);
  });

  it('holds the values of _tokens.scss', () => {
    for (const [, key, token] of exports.matchAll(/^\s+(\w+): (?:strip-unit\()?\$([\w-]+)/gm)) {
      const [, value] = new RegExp(`^\\$${token}: ([^;]+);`, 'm').exec(tokens) ?? [];

      expect(`${key}: ${value.replace(/(px|ms)$/, '')}`).toBe(
        `${key}: ${scssVariables[key as keyof typeof scssVariables]}`,
      );
    }
  });

  it('feeds real values into parameters', () => {
    expect(BREAKPOINTS).toEqual({ l: 1200, m: 992, s: 768, xl: 1400, xs: 480 });
    expect(COLOR_BACKGROUND).toBe('#f4f4f4');
    expect(RESULTS_ITEM_HEIGHT).toBe(40);
    expect(TOOLTIP_DURATION).toBe(100);
  });
});
