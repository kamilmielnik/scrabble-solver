import { expect, test } from '@playwright/test';

import * as Lib from '../lib';

test.describe('Words dictionary search', () => {
  test('searches the hovered word and its collisions in the dictionary', async ({ page }) => {
    await Lib.visitIndex(page);
    await Lib.typeBoard(page, 'cat', 'horizontal', { x: 3, y: 3 });
    await Lib.typeBoard(page, 'od', 'vertical', { x: 3, y: 4 });
    await Lib.typeBoard(page, 'dog', 'horizontal', { x: 8, y: 8 });
    await Lib.openWordsModal(page);

    await Lib.hoverWord(page, 3, 3, 'horizontal');
    await expect(Lib.getDictionaryInput(page)).toHaveValue('cat, cod');

    await Lib.hoverWord(page, 3, 3, 'vertical');
    await expect(Lib.getDictionaryInput(page)).toHaveValue('cod, cat');

    await Lib.hoverWord(page, 8, 8, 'horizontal');
    await expect(Lib.getDictionaryInput(page)).toHaveValue('dog');

    await expect(Lib.getModalDictionary(page)).toBeHidden();
  });

  test.describe('mobile', () => {
    test.use({ viewport: { width: 800, height: 900 } });

    test('shows the dictionary below the words table', async ({ page }) => {
      await Lib.visitIndex(page);
      await Lib.typeBoard(page, 'cat', 'horizontal', { x: 3, y: 3 });
      await Lib.openWordsModal(page);

      await expect(Lib.getModalDictionary(page)).toBeVisible();
    });
  });
});
