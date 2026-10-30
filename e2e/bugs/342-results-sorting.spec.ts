import { expect, test } from '@playwright/test';

import * as Lib from '../lib';

/*
 * @see https://github.com/kamilmielnik/scrabble-solver/issues/342
 */
test.describe('#342 - Incorrect sorting when filtering', () => {
  test('correctly sorts valid results first when text filter is active', async ({ page }) => {
    await Lib.visitIndex(page);
    await Lib.getSettingsButton(page).click();
    await Lib.getSettingOption(page, 'Language', 'Polski').check();
    await Lib.closeModal(page);
    await Lib.typeBoard(page, 'bopie', 'horizontal', { x: 6, y: 3 });
    await Lib.typeBoard(page, 'apu', 'vertical', { x: 8, y: 4 });
    await Lib.typeBoard(page, 'o', 'vertical', { x: 10, y: 4 });
    await Lib.typeRack(page, 'oe');
    await Lib.solve(page);
    await Lib.getResultsFilterInput(page).pressSequentially('p');

    await Lib.assertResult(page, 0, 'po', 5);
    await Lib.assertResult(page, 1, 'pe', 5);
    await Lib.assertResult(page, 2, 'op', 3);
    await Lib.assertResult(page, 3, 'eo', 6);
    await expect(Lib.getResult(page, 0)).not.toHaveAttribute('aria-hidden');
    await expect(Lib.getResult(page, 1)).not.toHaveAttribute('aria-hidden');
    await expect(Lib.getResult(page, 2)).not.toHaveAttribute('aria-hidden');
    await expect(Lib.getResult(page, 3)).toHaveAttribute('aria-hidden', 'true');
  });
});
