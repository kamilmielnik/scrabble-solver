import { expect, test } from '@playwright/test';

import { getSettingOption, getSettingsButton, goToIndex, solve, typeRack } from '../lib';

/*
 * @see https://github.com/kamilmielnik/scrabble-solver/issues/112
 */
test('Scrabble - Character bonus not applied (#112)', async ({ page }) => {
  await goToIndex(page);
  await getSettingsButton(page).click();
  await getSettingOption(page, { section: 'Language', option: 'Français' }).check();
  await page.keyboard.down('Escape');
  await typeRack(page, 'jours');
  await solve(page);
  await expect(page.getByText('40')).toHaveCount(2);
  await expect(page.getByText('26')).toHaveCount(2);
});
