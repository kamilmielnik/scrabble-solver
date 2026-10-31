import { describe, expect, it } from 'bun:test';
import { readdirSync, readFileSync } from 'node:fs';
import { join } from 'node:path';

const sourceDirectory = join(import.meta.dir, '..');
const stylesheets = readdirSync(sourceDirectory, { encoding: 'utf8', recursive: true }).filter((file) => {
  return file.endsWith('.scss');
});

describe('stylesheets', () => {
  it('find the stylesheets', () => {
    expect(stylesheets.length).toBeGreaterThan(30);
  });

  it('agree with the compact split: 1200px must land on the desktop side', () => {
    const wrongSide = stylesheets.filter((file) => {
      return /media\(\s*['"]>l['"]/.test(readFileSync(join(sourceDirectory, file), 'utf8'));
    });

    expect(wrongSide).toEqual([]);
  });

  it('show a pointer only on table rows that take a click', () => {
    const table = readFileSync(join(sourceDirectory, 'components/Table/Table.module.scss'), 'utf8');

    expect(table).toMatch(/\.clickable\s*\{[^}]*cursor:\s*pointer/);
  });

  it('highlight a table row on keyboard focus only, so a clicked row stops looking picked', () => {
    const table = readFileSync(join(sourceDirectory, 'components/Table/Table.module.scss'), 'utf8');
    const rowRules = table.slice(table.indexOf('.row {'), table.indexOf('.clickable')).replace(/\/\*[\s\S]*?\*\//g, '');

    expect(rowRules).toContain(':focus-visible');
    expect(rowRules).not.toMatch(/:focus(?!-visible)/);
  });
});
