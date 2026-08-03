import { expect, test } from '@playwright/test';

import {
  closeModal,
  getDictionaryInput,
  getResult,
  getSettingOption,
  getSettingsButton,
  solve,
  typeBoard,
  typeRack,
  visitIndex,
} from '../lib';

/*
 * @see https://github.com/kamilmielnik/scrabble-solver/issues/363
 */
test.describe('#363 - Dictionary input should display unique words', () => {
  test('highlighting a word should cause only unique new words to be looked up in the dictionary', async ({ page }) => {
    await page.route('**/api/dictionary/tr-TR/*', async (route) => {
      await new Promise((resolve) => setTimeout(resolve, 100));
      await route.fulfill({ body: '' });
    });

    await visitIndex(page);
    await getSettingsButton(page).click();
    await getSettingOption(page, 'Language', 'Türkçe').check();
    await closeModal(page);
    await typeBoard(page, 'ponje', 'horizontal', { x: 3, y: 7 });
    await typeRack(page, 'er');
    await solve(page);

    await getResult(page, 0).hover();

    await expect(getDictionaryInput(page)).toHaveValue('er, je');
  });
});
