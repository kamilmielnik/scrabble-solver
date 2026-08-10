import { expect, test } from '@playwright/test';

import * as Lib from '../lib';

/*
 * @see https://github.com/kamilmielnik/scrabble-solver/issues/363
 */
test.describe('#363 - Dictionary input should display unique words', () => {
  test('highlighting a word should cause only unique new words to be looked up in the dictionary', async ({ page }) => {
    await page.route('**/api/dictionary/tr-TR/*', async (route) => {
      await new Promise((resolve) => setTimeout(resolve, 100));
      await route.fulfill({ body: '' });
    });

    await Lib.visitIndex(page);
    await Lib.getSettingsButton(page).click();
    await Lib.getSettingOption(page, 'Language', 'Türkçe').check();
    await Lib.closeModal(page);
    await Lib.typeBoard(page, 'ponje', 'horizontal', { x: 3, y: 7 });
    await Lib.typeRack(page, 'er');
    await Lib.solve(page);

    await Lib.getResult(page, 0).hover();

    await expect(Lib.getDictionaryInput(page)).toHaveValue('er, je');
  });
});
