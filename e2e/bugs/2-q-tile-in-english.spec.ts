import { expect, test } from '@playwright/test';

import { assertResult, getResults, solve, typeBoard, typeRack, visitIndex } from '../lib';

/*
 * @see https://github.com/kamilmielnik/scrabble-solver/issues/2
 */
test.describe('#2 - "Q" tile does not work', () => {
  test('accepts "Q" tile in English', async ({ page }) => {
    await visitIndex(page);
    await typeBoard(page, 'i', 'horizontal', { x: 7, y: 7 });
    await typeRack(page, 'q');
    await solve(page);

    await expect(getResults(page)).toHaveCount(2);
    await assertResult(page, 0, 'qi', 11);
    await assertResult(page, 1, 'qi', 11);
  });
});
