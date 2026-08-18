import { expect, test } from '@playwright/test';

import * as Lib from '../lib';

test.describe('Words table sorting', () => {
  test('sorts by word, validity, and coordinates with the results-table sort behavior', async ({ page }) => {
    await Lib.visitIndex(page);
    await Lib.typeBoard(page, 'cat', 'horizontal', { x: 3, y: 3 });
    await Lib.typeBoard(page, 'zvq', 'horizontal', { x: 3, y: 5 });
    await Lib.openWordsModal(page);
    const modal = Lib.getOpenModal(page);

    await Lib.assertWord(page, 0, 'cat');
    await Lib.assertWord(page, 1, 'zvq');
    await expect(Lib.getWord(page, 0)).toContainText('4D');

    await modal.getByRole('button', { name: 'Word', exact: true }).click();
    await Lib.assertWord(page, 0, 'zvq');
    await Lib.assertWord(page, 1, 'cat');

    await modal.getByRole('button', { name: 'Validity', exact: true }).click();
    await Lib.assertWord(page, 0, 'cat');
    await Lib.assertWord(page, 1, 'zvq');

    await modal.getByRole('button', { name: 'Validity', exact: true }).click();
    await Lib.assertWord(page, 0, 'zvq');
    await Lib.assertWord(page, 1, 'cat');

    await modal.getByRole('button', { name: 'Coordinates', exact: true }).click();
    await Lib.assertWord(page, 0, 'cat');
    await Lib.assertWord(page, 1, 'zvq');
  });
});
