import { expect, test } from '@playwright/test';

import * as Lib from '../lib';

/**
 * @see https://github.com/kamilmielnik/scrabble-solver/issues/451
 */
test.describe('#451 - Stale highlight below a short results list', () => {
  test('clears the highlight when the pointer moves into the gap below the last result', async ({ page }) => {
    await Lib.visitIndex(page);
    await Lib.typeRack(page, 'qi');
    await Lib.solve(page);

    const results = Lib.getResults(page);
    await expect(results.first()).toBeVisible();
    await Lib.hoverResult(page, (await results.count()) - 1);

    const highlightedTiles = page.locator('[role="mark"]');
    await expect(highlightedTiles.first()).toBeVisible();

    const list = Lib.getResultsContainer(page).locator('[role="list"]');
    const listBox = await list.boundingBox();
    const listContainerBox = await list.locator('..').boundingBox();

    if (!listBox || !listContainerBox) {
      throw new Error('Expected the results list and its container to be visible');
    }

    const gapY = listBox.y + listBox.height + 20;
    expect(gapY).toBeLessThan(listContainerBox.y + listContainerBox.height);
    await page.mouse.move(listBox.x + listBox.width / 2, gapY);

    await expect(highlightedTiles).toHaveCount(0);
  });
});
