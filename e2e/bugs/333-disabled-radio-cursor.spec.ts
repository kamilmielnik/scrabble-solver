import { expect, test } from '@playwright/test';

import * as Lib from '../lib';

/*
 * @see https://github.com/kamilmielnik/scrabble-solver/issues/333
 */
test.describe('#333 - Disabled radio button has cursor: pointer', () => {
  test('Disabled radio button has cursor: not-allowed', async ({ page }) => {
    await Lib.visitIndex(page);
    await Lib.getSettingsButton(page).click();
    await Lib.getSettingOption(page, 'Language', 'Polski').check();
    await Lib.getSettingOption(page, 'Gra', 'Scrabble').scrollIntoViewIfNeeded();

    await expect(Lib.getSettingOption(page, 'Gra', 'Super Scrabble')).toBeDisabled();
    await expect(Lib.getSettingOption(page, 'Gra', 'Super Scrabble')).toHaveCSS('cursor', 'not-allowed');
  });
});
