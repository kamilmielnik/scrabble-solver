import { readFileSync } from 'node:fs';
import { join } from 'node:path';

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
});
