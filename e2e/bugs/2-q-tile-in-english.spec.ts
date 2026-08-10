import { expect, test } from '@playwright/test';

import * as Lib from '../lib';

/*
 * @see https://github.com/kamilmielnik/scrabble-solver/issues/2
 */
test.describe('#2 - "Q" tile does not work', () => {
  test('accepts "Q" tile in English', async ({ page }) => {
    await Lib.visitIndex(page);
    await Lib.typeBoard(page, 'i', 'horizontal', { x: 7, y: 7 });
    await Lib.typeRack(page, 'q');
    await Lib.solve(page);

    await expect(Lib.getResults(page)).toHaveCount(2);
    await Lib.assertResult(page, 0, 'qi', 11);
    await Lib.assertResult(page, 1, 'qi', 11);
  });
});
