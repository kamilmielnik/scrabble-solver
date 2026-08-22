import { expect, test } from '@playwright/test';

import * as Lib from '../lib';

test.describe('Words table filtering', () => {
  test('groups matching words first and dims the rest', async ({ page }) => {
    await Lib.visitIndex(page);
    await Lib.typeBoard(page, 'cat', 'horizontal', { x: 3, y: 3 });
    await Lib.typeBoard(page, 'dog', 'horizontal', { x: 3, y: 5 });
    await Lib.openWordsModal(page);

    await Lib.assertWord(page, 0, 'cat');
    await Lib.assertWord(page, 1, 'dog');

    await Lib.getWordsFilterInput(page).pressSequentially('d');

    await Lib.assertWord(page, 0, 'dog');
    await Lib.assertWord(page, 1, 'cat');
    await expect(Lib.getWord(page, 0)).not.toHaveAttribute('aria-hidden');
    await expect(Lib.getWord(page, 1)).toHaveAttribute('aria-hidden', 'true');
  });
});
