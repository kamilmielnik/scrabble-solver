import { expect, type Page, test } from '@playwright/test';

import { assertResult, getResults, solve, typeBoard, typeRack, visitIndex } from '../lib';

test.describe('Solver paths', () => {
  test('solves through the server when no dictionary is available locally', async ({ page }) => {
    await page.route('**/api/dictionary/*', (route) => route.fulfill({ status: 503 }));
    const solveResponse = page.waitForResponse('**/api/solve');
    await visitIndex(page);
    await typeBoard(page, 'i', 'horizontal', { x: 7, y: 7 });
    await typeRack(page, 'q');
    await solve(page);
    await solveResponse;

    await expect(getResults(page)).toHaveCount(2);
    await assertResult(page, 0, 'qi', 11);
  });

  test('solves locally once the dictionary is cached', async ({ page }) => {
    await visitIndex(page);
    await waitForCachedDictionary(page);

    let solveRequestCount = 0;
    await page.route('**/api/solve', (route) => {
      solveRequestCount += 1;
      return route.continue();
    });
    await typeBoard(page, 'i', 'horizontal', { x: 7, y: 7 });
    await typeRack(page, 'q');
    await solve(page);

    await expect(getResults(page)).toHaveCount(2);
    await assertResult(page, 0, 'qi', 11);
    expect(solveRequestCount).toBe(0);
  });
});

function waitForCachedDictionary(page: Page) {
  return page.waitForFunction(
    async () => {
      const cache = await caches.open('dictionary-api-cache');
      return typeof (await cache.match('/api/dictionary/en-US')) !== 'undefined';
    },
    undefined,
    { timeout: 30000 },
  );
}
