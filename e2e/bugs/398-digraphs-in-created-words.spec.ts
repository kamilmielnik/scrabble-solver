import { expect, test } from '@playwright/test';

import { closeModal, getOpenModal, getSettingOption, getSettingsButton, pasteBoard, visitIndex } from '../lib';

/*
 * @see https://github.com/kamilmielnik/scrabble-solver/issues/398
 */
test.describe('#398 - Solitary digraph tiles are recognised as created words', () => {
  test('should transliterate special characters when pasting in French', async ({ page }) => {
    await visitIndex(page);
    await getSettingsButton(page).click();
    await getSettingOption(page, 'Language', 'Español').check();
    await closeModal(page);
    await pasteBoard(page, 'chiclean', 'horizontal', { x: 3, y: 7 });
    await page.getByLabel('Palabras creadas', { exact: true }).click();

    const modal = getOpenModal(page);
    await expect(modal.getByText('ch', { exact: true })).toHaveCount(0);
    await expect(modal.getByText('chiclean', { exact: true })).toBeVisible();
    await expect(modal.getByLabel('Incorrecto', { exact: true }).getByText('0', { exact: true })).toBeVisible();
    await expect(modal.getByLabel('Correcto', { exact: true }).getByText('1', { exact: true })).toBeVisible();
  });
});
