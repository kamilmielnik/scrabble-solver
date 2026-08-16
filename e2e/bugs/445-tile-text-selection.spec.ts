import { expect, test } from '@playwright/test';

import * as Lib from '../lib';

/**
 * @see https://github.com/kamilmielnik/scrabble-solver/issues/445
 */
test.describe('#445 - Text selection not disabled in tiles', () => {
  test('Tile input declares user-select: none and a transparent selection highlight', async ({ page }) => {
    await Lib.visitIndex(page);
    const inputClass = await Lib.getBoardTile(page, 0, 0).getAttribute('class');

    await expect(Lib.getRackTile(page, 0)).toHaveClass(inputClass ?? '');

    const declarations = await page.evaluate((selector) => {
      const styleBySelector = new Map<string, CSSStyleDeclaration>();

      for (const sheet of Array.from(document.styleSheets)) {
        for (const rule of Array.from(sheet.cssRules)) {
          if (rule instanceof CSSStyleRule) {
            for (const selectorPart of rule.selectorText.split(',')) {
              styleBySelector.set(selectorPart.trim(), rule.style);
            }
          }
        }
      }

      return {
        userSelect: styleBySelector.get(selector)?.userSelect,
        selectionBackground: styleBySelector.get(`${selector}::selection`)?.backgroundColor,
      };
    }, `.${inputClass}`);

    expect(declarations.userSelect).toBe('none');
    // The production build minifies "transparent" to "rgba(0, 0, 0, 0)".
    expect(['transparent', 'rgba(0, 0, 0, 0)']).toContain(declarations.selectionBackground);
  });
});
