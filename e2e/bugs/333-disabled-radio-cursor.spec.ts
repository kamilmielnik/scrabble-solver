import { expect, test } from '@playwright/test';

import { getSettingOption, getSettingsButton, visitIndex } from '../lib';

/*
 * @see https://github.com/kamilmielnik/scrabble-solver/issues/333
 */
test.describe('#333 - Disabled radio button has cursor: pointer', () => {
  test('Disabled radio button has cursor: not-allowed', async ({ page }) => {
    await visitIndex(page);
    await getSettingsButton(page).click();
    await getSettingOption(page, 'Language', 'Polski').check();
    await getSettingOption(page, 'Gra', 'Scrabble').scrollIntoViewIfNeeded();

    await expect(getSettingOption(page, 'Gra', 'Super Scrabble')).toBeDisabled();
    await expect(getSettingOption(page, 'Gra', 'Super Scrabble')).toHaveCSS('cursor', 'not-allowed');
  });
});
