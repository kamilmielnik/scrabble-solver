import { expect, test } from '@playwright/test';

import * as Lib from '../lib';

/*
 * @see https://github.com/kamilmielnik/scrabble-solver/issues/129
 */
test.describe('#129 - Esc does not close the sidebar when letters input is focused', () => {
  test('Esc key closes the sidebar when rack is focused', async ({ page }) => {
    await Lib.visitIndex(page);
    await Lib.getSettingsButton(page).click();
    await Lib.typeRack(page, 'a');
    await page.keyboard.press('Escape');

    await expect(Lib.getModal(page)).toHaveCount(0);
  });
});
