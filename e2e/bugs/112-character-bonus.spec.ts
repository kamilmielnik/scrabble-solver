import { test } from '@playwright/test';

import * as Lib from '../lib';

/*
 * @see https://github.com/kamilmielnik/scrabble-solver/issues/112
 */
test.describe('#112 - Scrabble - Character bonus not applied', () => {
  test('correctly shows points for a result which gets a character bonus', async ({ page }) => {
    await Lib.visitIndex(page);

    await Lib.getSettingsButton(page).click();
    await Lib.getSettingOption(page, 'Language', 'Français').check();
    await Lib.closeModal(page);
    await Lib.typeRack(page, 'jours');
    await Lib.solve(page);

    await Lib.assertResult(page, 0, 'jours', 40);
    await Lib.assertResult(page, 1, 'jours', 40);
    await Lib.assertResult(page, 2, 'jours', 26);
    await Lib.assertResult(page, 3, 'jours', 26);
    await Lib.assertResult(page, 4, 'jours', 24);
    await Lib.assertResult(page, 5, 'jours', 24);
  });
});
