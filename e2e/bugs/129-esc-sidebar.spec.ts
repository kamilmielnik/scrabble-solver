import { expect, test } from '@playwright/test';

import { getModal, getSettingsButton, typeRack, visitIndex } from '../lib';

/*
 * @see https://github.com/kamilmielnik/scrabble-solver/issues/129
 */
test.describe('#129 - Esc does not close the sidebar when letters input is focused', () => {
  test('Esc key closes the sidebar when rack is focused', async ({ page }) => {
    await visitIndex(page);
    await getSettingsButton(page).click();
    await typeRack(page, 'a');
    await page.keyboard.press('Escape');

    await expect(getModal(page)).toHaveCount(0);
  });
});
