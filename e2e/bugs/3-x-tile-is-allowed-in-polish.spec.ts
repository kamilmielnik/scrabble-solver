import { expect, test } from '@playwright/test';

import { getSettingOption, getSettingsButton, goToIndex, typeBoard, typeRack } from '../lib';

/*
 * @see https://github.com/kamilmielnik/scrabble-solver/issues/3
 */
test('X tile is allowed in Polish language (scrabble-solver#3)', async ({ page }) => {
  await goToIndex(page);
  await getSettingsButton(page).click();
  await getSettingOption(page, { section: 'Language', option: 'Polski' }).check();
  await page.keyboard.press('Escape');
  await typeBoard(page, 'x', { row: 8, column: 8 });
  await typeRack(page, 'x');
  await expect(page.getByText('x')).toHaveCount(0);
});
