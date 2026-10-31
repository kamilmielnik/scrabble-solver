import { expect, test } from '@playwright/test';

import * as Lib from '../lib';

test.describe('Words modal dictionary', () => {
  test('stays hidden on desktop, where the sidebar shows the dictionary', async ({ page }) => {
    await Lib.visitIndex(page);
    await Lib.typeBoard(page, 'cat', 'horizontal', { x: 3, y: 3 });
    await Lib.openWordsModal(page);

    await expect(Lib.getModalDictionary(page)).toBeHidden();
  });

  test.describe('mobile', () => {
    test.use({ viewport: { width: 800, height: 900 } });

    test('shows the dictionary below the words table', async ({ page }) => {
      await Lib.visitIndex(page);
      await Lib.typeBoard(page, 'cat', 'horizontal', { x: 3, y: 3 });
      await Lib.openWordsModal(page);

      await expect(Lib.getModalDictionary(page)).toBeVisible();
    });
  });
});
