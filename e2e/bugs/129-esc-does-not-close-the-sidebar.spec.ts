import { expect, test } from '@playwright/test';

import { getModal, getSettingsButton, goToIndex, typeRack } from '../lib';

/*
 * @see https://github.com/kamilmielnik/scrabble-solver/issues/129
 */
test('Esc does not close the sidebar when letters input is focused (#129)', async ({ page }) => {
  await goToIndex(page);
  await getSettingsButton(page).click();
  await page.keyboard.press('Escape');
  await typeRack(page, 'a');
  await expect(getModal(page)).not.toBeAttached();
});
