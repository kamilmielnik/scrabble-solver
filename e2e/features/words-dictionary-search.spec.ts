import { expect, type Page, test } from '@playwright/test';

import * as Lib from '../lib';

test.describe('Words dictionary search', () => {
  test('searches the hovered word and its collisions in the dictionary', async ({ page }) => {
    await Lib.visitIndex(page);
    await Lib.typeBoard(page, 'cat', 'horizontal', { x: 3, y: 3 });
    await Lib.typeBoard(page, 'od', 'vertical', { x: 3, y: 4 });
    await Lib.typeBoard(page, 'dog', 'horizontal', { x: 8, y: 8 });
    await openWordsModal(page);

    await Lib.hoverWord(page, 3, 3, 'horizontal');
    await expect(Lib.getDictionaryInput(page)).toHaveValue('cat, cod');

    await Lib.hoverWord(page, 3, 3, 'vertical');
    await expect(Lib.getDictionaryInput(page)).toHaveValue('cod, cat');

    await Lib.hoverWord(page, 8, 8, 'horizontal');
    await expect(Lib.getDictionaryInput(page)).toHaveValue('dog');
  });
});

async function openWordsModal(page: Page) {
  await page.getByLabel('Created words', { exact: true }).click();
  await expect(Lib.getOpenModal(page)).toBeVisible();
}
