import { expect, test } from '@playwright/test';

import * as Lib from '../lib';

/*
 * @see https://github.com/kamilmielnik/scrabble-solver/issues/398
 */
test.describe('#398 - Solitary digraph tiles are recognised as created words', () => {
  test('should transliterate special characters when pasting in French', async ({ page }) => {
    await Lib.visitIndex(page);
    await Lib.getSettingsButton(page).click();
    await Lib.getSettingOption(page, 'Language', 'Español').check();
    await Lib.closeModal(page);
    await Lib.pasteBoard(page, 'chiclean', 'horizontal', { x: 3, y: 7 });
    await page.getByLabel('Palabras creadas', { exact: true }).click();

    const modal = Lib.getOpenModal(page);
    await expect(modal.getByText('ch', { exact: true })).toHaveCount(0);
    await expect(modal.getByText('chiclean', { exact: true })).toBeVisible();
    await expect(modal.getByLabel('Incorrecto', { exact: true })).toHaveCount(0);
    await expect(modal.getByLabel('Correcto', { exact: true })).toHaveCount(1);
  });
});
