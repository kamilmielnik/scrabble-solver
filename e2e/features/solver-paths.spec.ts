import { expect, type Page, test } from '@playwright/test';

import * as Lib from '../lib';

test.describe('Solver paths', () => {
  test('solves through the server when no dictionary is available locally', async ({ page }) => {
    await page.route('**/api/dictionary/*', (route) => route.fulfill({ status: 503 }));
    const solveResponse = page.waitForResponse('**/api/solve');
    await Lib.visitIndex(page);
    await Lib.typeBoard(page, 'i', 'horizontal', { x: 7, y: 7 });
    await Lib.typeRack(page, 'q');
    await Lib.solve(page);
    await solveResponse;

    await expect(Lib.getResults(page)).toHaveCount(2);
    await Lib.assertResult(page, 0, 'qi', 11);
  });

  test('solves locally once the dictionary is cached', async ({ page }) => {
    await Lib.visitIndex(page);
    await Lib.typeBoard(page, 'i', 'horizontal', { x: 7, y: 7 });
    await Lib.typeRack(page, 'q');
    await waitForCachedDictionary(page);

    let solveRequestCount = 0;
    await page.route('**/api/solve', (route) => {
      solveRequestCount += 1;
      return route.continue();
    });
    await Lib.solve(page);

    await expect(Lib.getResults(page)).toHaveCount(2);
    await Lib.assertResult(page, 0, 'qi', 11);
    expect(solveRequestCount).toBe(0);
  });
});

function waitForCachedDictionary(page: Page): Promise<void> {
  return expect.poll(() => page.evaluate(isDictionaryCached), { timeout: 30000 }).toBe(true);
}

async function isDictionaryCached(): Promise<boolean> {
  const cache = await caches.open('dictionary-api-cache');
  return typeof (await cache.match('/api/dictionary/en-US')) !== 'undefined';
}
