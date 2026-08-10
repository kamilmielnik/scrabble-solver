import { expect, test } from '@playwright/test';

import * as Lib from '../lib';

/*
 * @see https://github.com/kamilmielnik/scrabble-solver/issues/352
 */
test.describe('#352 - Race condition: dictionary result shows up after clearing the board', () => {
  test('Clearing the board prevents pending dictionary results from showing up', async ({ page }) => {
    await page.route('**/api/dictionary/en-US/123', async (route) => {
      await new Promise((resolve) => setTimeout(resolve, 100));
      await route.fulfill({ body: '' });
    });

    await Lib.visitIndex(page);

    const dictionaryResponse = page.waitForResponse('**/api/dictionary/en-US/123');
    await Lib.getDictionaryInput(page).pressSequentially('123');
    await Lib.getDictionaryInput(page).press('Enter');
    await page.getByLabel('Clear', { exact: true }).click();
    await dictionaryResponse;

    await expect(Lib.getDictionary(page)).not.toContainText('This word is not allowed');
    await expect(Lib.getDictionary(page)).not.toContainText('Unexpected end of JSON input');
    await expect(Lib.getDictionary(page)).toContainText('Word definition will be shown here.');
  });
});
