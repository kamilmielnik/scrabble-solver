import { expect, test } from '@playwright/test';

import { goToIndex, solve, typeBoard, typeRack } from '../lib';

/*
 * @see https://github.com/kamilmielnik/scrabble-solver/issues/2
 */
test('"Q" tile does not work (#2)', async ({ page }) => {
  await goToIndex(page);
  await typeBoard(page, 'i', { row: 8, column: 8 });
  await typeRack(page, 'q');
  await solve(page);
  await expect(page.getByLabel('qi')).toHaveCount(2);
});
