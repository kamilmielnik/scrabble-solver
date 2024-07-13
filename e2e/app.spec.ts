import { expect, test } from '@playwright/test';

import { getSettingOption, getSettingsButton, goToIndex } from './lib';

test.describe('App', () => {
  test.beforeEach(async ({ page }) => {
    await goToIndex(page);
  });

  test('has title', async ({ page }) => {
    await expect(page).toHaveTitle('Scrabble Solver 2 by Kamil Mielnik');
  });

  test('has default setting values', async ({ page }) => {
    await getSettingsButton(page).click();

    await expect(getSettingOption(page, { section: 'Game', option: 'Scrabble' })).toBeChecked();
    await expect(getSettingOption(page, { section: 'Language', option: 'English (US)' })).toBeChecked();
    await expect(getSettingOption(page, { section: 'Coordinates', option: 'Hidden' })).toBeChecked();
    await expect(getSettingOption(page, { section: 'Input mode', option: 'Keyboard' })).toBeChecked();
    await expect(getSettingOption(page, { section: 'Group remaining tiles', option: 'Do not group' })).toBeChecked();
  });
});
