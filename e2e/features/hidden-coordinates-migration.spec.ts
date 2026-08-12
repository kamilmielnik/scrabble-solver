import { expect, test } from '@playwright/test';

import * as Lib from '../lib';

/*
 * The 'hidden' showCoordinates option was removed on 2026/08/13.
 * Delete this spec together with migrateHiddenShowCoordinates.
 */
test.describe('"hidden" coordinates migration', () => {
  test('falls back to original coordinates when storage holds the removed "hidden" option', async ({ page }) => {
    await page.addInitScript(() => {
      localStorage.setItem('scrabble-solver.settings', JSON.stringify({ showCoordinates: 'hidden' }));
    });

    await Lib.visitIndex(page);

    await expect(Lib.getBoardContainer(page).getByText('A', { exact: true })).toBeVisible();

    await Lib.getSettingsButton(page).click();
    await expect(Lib.getSettingOption(page, 'Coordinates', 'Original')).toBeChecked();
    await Lib.closeModal(page);

    await expect
      .poll(() => page.evaluate(() => localStorage.getItem('scrabble-solver.settings')))
      .toContain('"showCoordinates":"original"');
  });
});
