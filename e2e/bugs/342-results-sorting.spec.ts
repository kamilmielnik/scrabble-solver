import { expect, test } from '@playwright/test';

import {
  assertResult,
  closeModal,
  getResult,
  getResultsFilterInput,
  getSettingOption,
  getSettingsButton,
  solve,
  typeBoard,
  typeRack,
  visitIndex,
} from '../lib';

/*
 * @see https://github.com/kamilmielnik/scrabble-solver/issues/342
 */
test.describe('#342 - Incorrect sorting when filtering', () => {
  test('correctly sorts valid results first when text filter is active', async ({ page }) => {
    await visitIndex(page);
    await getSettingsButton(page).click();
    await getSettingOption(page, 'Language', 'Polski').check();
    await closeModal(page);
    await typeBoard(page, 'bopie', 'horizontal', { x: 6, y: 3 });
    await typeBoard(page, 'apu', 'vertical', { x: 8, y: 4 });
    await typeBoard(page, 'o', 'vertical', { x: 10, y: 4 });
    await typeRack(page, 'oe');
    await solve(page);
    await getResultsFilterInput(page).pressSequentially('p');

    await assertResult(page, 0, 'po', 5);
    await assertResult(page, 1, 'pe', 5);
    await assertResult(page, 2, 'op', 3);
    await assertResult(page, 3, 'eo', 6);
    await expect(getResult(page, 0)).not.toHaveAttribute('aria-hidden');
    await expect(getResult(page, 1)).not.toHaveAttribute('aria-hidden');
    await expect(getResult(page, 2)).not.toHaveAttribute('aria-hidden');
    await expect(getResult(page, 3)).toHaveAttribute('aria-hidden', 'true');
  });
});
