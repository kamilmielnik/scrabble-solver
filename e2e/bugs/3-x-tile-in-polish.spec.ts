import { expect, test } from '@playwright/test';

import { closeModal, getSettingOption, getSettingsButton, typeBoard, typeRack, visitIndex } from '../lib';

/*
 * @see https://github.com/kamilmielnik/scrabble-solver/issues/3
 */
test.describe('#3 - "X" tile is allowed in Polish', () => {
  test('does not accept "X" tile in Polish', async ({ page }) => {
    await visitIndex(page);
    await getSettingsButton(page).click();
    await getSettingOption(page, 'Language', 'Polski').check();
    await closeModal(page);
    await typeBoard(page, 'x', 'horizontal', { x: 7, y: 7 });
    await typeRack(page, 'x');

    await expect(page.getByText('x', { exact: true })).toHaveCount(0);
  });
});
