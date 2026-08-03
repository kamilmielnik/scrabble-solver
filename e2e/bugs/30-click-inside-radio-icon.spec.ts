import { expect, test } from '@playwright/test';

import { getSettingOption, getSettingsButton, visitIndex } from '../lib';

/*
 * @see https://github.com/kamilmielnik/scrabble-solver/issues/30
 */
test.describe('#30 - Clicking inside an icon of non-first unchecked radio button does not select that option', () => {
  test('Clicking inside an icon of first unchecked radio button selects it', async ({ page }) => {
    await visitIndex(page);
    await getSettingsButton(page).click();
    await getSettingOption(page, 'Language', 'English (GB)').click();

    const icon = getSettingOption(page, 'Language', 'English (US)')
      .locator('..')
      .getByRole('img', { includeHidden: true })
      .first();

    // force - the icon is fully covered by the radio's invisible input overlay,
    // which is exactly what a click at the icon's coordinates is meant to hit
    await icon.click({ force: true });

    await expect(getSettingOption(page, 'Language', 'English (US)')).toBeChecked();
  });
});
