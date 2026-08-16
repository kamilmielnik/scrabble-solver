import { expect, test } from '@playwright/test';

import * as Lib from '../lib';

/*
 * A translations cache written by a build that knew fewer translation keys
 * crashed translate() on the keys added since.
 */
test.describe('Stale translations cache', () => {
  test('recovers when the cached translations are missing a newly added key', async ({ page }) => {
    await Lib.visitIndex(page);
    await page.keyboard.press('Shift');
    await page.waitForFunction(() => {
      return Object.keys(localStorage).some((storageKey) => storageKey.includes('translations'));
    });

    await page.evaluate(() => {
      const key = Object.keys(localStorage).find((storageKey) => storageKey.includes('translations'));

      if (!key) {
        throw new Error('Translations cache not found');
      }

      const stored = JSON.parse(localStorage.getItem(key) as string) as { translations: Record<string, string> };
      delete stored.translations['words.validity'];
      localStorage.setItem(key, JSON.stringify(stored));
    });
    await page.reload();

    await page.getByLabel('Created words', { exact: true }).click();
    await expect(Lib.getOpenModal(page).getByRole('button', { name: 'Validity', exact: true })).toBeVisible();
  });
});
