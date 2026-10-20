import { expect, test } from '@playwright/test';

import * as Lib from '../lib';

/*
 * @see https://github.com/kamilmielnik/scrabble-solver/issues/461
 */
test.describe('#461 - Highlighting ignores regular expressions in filters', () => {
  test('highlights the regular expression matches in the words table', async ({ page }) => {
    await Lib.visitIndex(page);
    await Lib.typeBoard(page, 'cat', 'horizontal', { x: 3, y: 3 });
    await Lib.typeBoard(page, 'dog', 'horizontal', { x: 3, y: 5 });
    await Lib.openWordsModal(page);

    await Lib.getWordsFilterInput(page).pressSequentially('^d|t$');

    await Lib.assertWord(page, 0, 'cat');
    await Lib.assertWord(page, 1, 'dog');
    await expect(Lib.getWord(page, 0).locator('mark')).toHaveText('t');
    await expect(Lib.getWord(page, 1).locator('mark')).toHaveText('d');
  });

  test('highlights the regular expression matches in the results table', async ({ page }) => {
    await Lib.visitIndex(page);
    await Lib.typeBoard(page, 'i', 'horizontal', { x: 7, y: 7 });
    await Lib.typeRack(page, 'q');
    await Lib.solve(page);

    await Lib.getResultsFilterInput(page).pressSequentially('^q');

    await expect(Lib.getResult(page, 0).locator('mark')).toHaveText('q');
  });
});
