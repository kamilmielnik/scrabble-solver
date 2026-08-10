import { expect, test } from '@playwright/test';

import * as Lib from '../lib';

/*
 * @see https://github.com/kamilmielnik/scrabble-solver/issues/3
 */
test.describe('#3 - "X" tile is allowed in Polish', () => {
  test('does not accept "X" tile in Polish', async ({ page }) => {
    await Lib.visitIndex(page);
    await Lib.getSettingsButton(page).click();
    await Lib.getSettingOption(page, 'Language', 'Polski').check();
    await Lib.closeModal(page);
    await Lib.typeBoard(page, 'x', 'horizontal', { x: 7, y: 7 });
    await Lib.typeRack(page, 'x');

    await expect(page.getByText('x', { exact: true })).toHaveCount(0);
  });
});
