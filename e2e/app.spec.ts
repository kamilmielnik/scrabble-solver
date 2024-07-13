import { expect, test } from '@playwright/test';

import { getSettingsButton, goToIndex } from './lib';

test.describe('App', () => {
  test.beforeEach(async ({ page }) => {
    await goToIndex(page);
  });

  test('has title', async ({ page }) => {
    await expect(page).toHaveTitle('Scrabble Solver 2 by Kamil Mielnik');
  });

  test('has default setting values', async ({ page }) => {
    await getSettingsButton(page).click();
    await expect(page.getByRole('radio', { exact: true, name: 'Scrabble' })).toBeChecked();
    await expect(page.getByRole('radio', { exact: true, name: 'English (US)' })).toBeChecked();
    await expect(page.getByRole('radio', { exact: true, name: 'Hidden' })).toBeChecked();
    await expect(page.getByRole('radio', { exact: true, name: 'Keyboard' })).toBeChecked();
    await expect(page.getByRole('radio', { exact: true, name: 'Do not group' })).toBeChecked();
  });
});
