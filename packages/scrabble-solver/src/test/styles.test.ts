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

  it('import the shared keyframes wherever they animate with them, because CSS modules rename the missing ones', () => {
    const animations = readFileSync(join(sourceDirectory, 'styles/animations.scss'), 'utf8');
    const keyframes = Array.from(animations.matchAll(/@keyframes\s+([\w-]+)/g), ([, name]) => name);
    const withoutImport = stylesheets.filter((file) => {
      const stylesheet = readFileSync(join(sourceDirectory, file), 'utf8');
      const declarations = Array.from(stylesheet.matchAll(/animation(?:-name)?:([^;]+);/g));
      const animationNames = declarations.flatMap(([, value]) => value.split(/[\s,]+/));

      return (
        animationNames.some((name) => keyframes.includes(name)) && !stylesheet.includes("@use 'styles/animations'")
      );
    });

    expect(keyframes.length).toBeGreaterThan(0);
    expect(withoutImport).toEqual([]);
  });

  it('show a pointer only on table rows that take a click', () => {
    const table = readFileSync(join(sourceDirectory, 'components/Table/Table.module.scss'), 'utf8');

    expect(table).toMatch(/\.clickable\s*\{[^}]*cursor:\s*pointer/);
  });

  it('let the content of a closing modal ignore the pointer, so that a row it slides out from under cannot be picked again', () => {
    const modal = readFileSync(join(sourceDirectory, 'components/Modal/Modal.module.scss'), 'utf8');

    expect(modal).toMatch(/\.beforeClose\s*\{\s*\.container\s*\{[^}]*pointer-events:\s*none/);
  });

  it('paint a table row as picked from its state only, so focus or hover on another row cannot look picked', () => {
    const table = readFileSync(join(sourceDirectory, 'components/Table/Table.module.scss'), 'utf8');
    const rowRules = table
      .slice(table.indexOf('.row {'), table.indexOf('.clickable'))
      .replace(/\/\*[\s\S]*?\*\/|\/\/.*$/gm, '');

    expect(rowRules).not.toContain(':hover');
    expect(rowRules).not.toMatch(/:focus[^{]*\{[^}]*(background|color)/);
  });
});
