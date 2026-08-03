import { test } from '@playwright/test';

import { assertResult, closeModal, getSettingOption, getSettingsButton, solve, typeRack, visitIndex } from '../lib';

/*
 * @see https://github.com/kamilmielnik/scrabble-solver/issues/112
 */
test.describe('#112 - Scrabble - Character bonus not applied', () => {
  test('correctly shows points for a result which gets a character bonus', async ({ page }) => {
    await visitIndex(page);

    await getSettingsButton(page).click();
    await getSettingOption(page, 'Language', 'Français').check();
    await closeModal(page);
    await typeRack(page, 'jours');
    await solve(page);

    await assertResult(page, 0, 'jours', 40);
    await assertResult(page, 1, 'jours', 40);
    await assertResult(page, 2, 'jours', 26);
    await assertResult(page, 3, 'jours', 26);
    await assertResult(page, 4, 'jours', 24);
    await assertResult(page, 5, 'jours', 24);
  });
});
