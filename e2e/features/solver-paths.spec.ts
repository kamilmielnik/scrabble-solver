import { type Page, expect, test } from '@playwright/test';

import * as Lib from '../lib';

const LOCALES = [
  ['de-DE', 'haus'],
  ['en-GB', 'cat'],
  ['en-US', 'cat'],
  ['es-ES', 'casa'],
  ['fa-IR', 'باد'],
  ['fr-FR', 'chat'],
  ['pl-PL', 'kot'],
  ['ro-RO', 'casa'],
  ['tr-TR', 'kalem'],
];

test.describe('Solver paths', () => {
  test.describe('through the server', () => {
    test('solves when no dictionary is available locally', async ({ page }) => {
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

    test('verifies the board when no dictionary is available locally', async ({ page }) => {
      await page.route('**/api/dictionary/*', (route) => route.fulfill({ status: 503 }));
      const verifyResponse = page.waitForResponse('**/api/verify');
      await Lib.visitIndex(page);
      await Lib.typeBoard(page, 'zvq', 'horizontal', { x: 3, y: 3 });
      await verifyResponse;
      await Lib.openWordsModal(page);

      await expect(page.getByTestId('word-3-3-horizontal').getByLabel('Invalid', { exact: true })).toBeVisible();
    });

    test('solves in a browser without web workers', async ({ page }) => {
      await page.addInitScript(() => {
        Object.defineProperty(window, 'Worker', { value: undefined });
      });
      const solveResponse = page.waitForResponse('**/api/solve');
      await solveQi(page);
      await solveResponse;

      await Lib.assertResult(page, 0, 'qi', 11);
    });

    test('solves when the worker crashes on start', async ({ page }) => {
      await page.addInitScript(() => {
        const crashingScript = URL.createObjectURL(new Blob(['throw new Error("crashed")']));
        const { Worker: RealWorker } = window;

        window.Worker = class extends RealWorker {
          public constructor() {
            super(crashingScript);
          }
        };
      });
      const solveResponse = page.waitForResponse('**/api/solve');
      await solveQi(page);
      await solveResponse;

      await Lib.assertResult(page, 0, 'qi', 11);
    });

    test('agrees with the worker on every result', async ({ page, request }) => {
      await Lib.visitIndex(page);
      await Lib.typeBoard(page, 'cat', 'horizontal', { x: 6, y: 7 });
      await Lib.typeRack(page, 's');
      await Lib.waitForCachedDictionary(page);
      await Lib.solve(page);

      const board = await page.evaluate(() => {
        return JSON.parse(JSON.parse(localStorage.getItem('scrabble-solver.board') ?? '""') as string) as unknown;
      });
      const response = await request.post('/api/solve', {
        data: { board, characters: ['s'], game: 'scrabble', locale: 'en-US' },
      });
      const serverPoints = ((await response.json()) as { points: number }[]).map(({ points }) => points);
      const workerPoints = await Lib.getResults(page).getByTestId('points').allTextContents();

      expect(workerPoints.map(Number).toSorted(byNumber)).toEqual(serverPoints.toSorted(byNumber));
    });
  });

  test.describe('in the worker', () => {
    test('solves without asking the server once the dictionary is cached', async ({ page }) => {
      await Lib.visitIndex(page);
      await Lib.typeBoard(page, 'i', 'horizontal', { x: 7, y: 7 });
      await Lib.typeRack(page, 'q');
      await Lib.waitForCachedDictionary(page);
      const solveRequests = Lib.trackRequests(page, '/api/solve');
      await Lib.solve(page);

      await expect(Lib.getResults(page)).toHaveCount(2);
      await Lib.assertResult(page, 0, 'qi', 11);
      expect(solveRequests).toEqual([]);
    });

    test('verifies without asking the server once the dictionary is cached', async ({ page }) => {
      await Lib.visitIndex(page);
      await Lib.typeRack(page, 'q');
      await Lib.waitForCachedDictionary(page);
      const verifyRequests = Lib.trackRequests(page, '/api/verify');
      await Lib.typeBoard(page, 'cat', 'horizontal', { x: 3, y: 3 });
      await Lib.openWordsModal(page);

      await expect(page.getByTestId('word-3-3-horizontal').getByLabel('Valid', { exact: true })).toBeVisible();
      expect(verifyRequests).toEqual([]);
    });

    test('keeps solving and verifying with no network at all', async ({ context, page }) => {
      await Lib.visitIndex(page);
      await Lib.typeRack(page, 's');
      await Lib.waitForCachedDictionary(page);
      await context.setOffline(true);
      await Lib.typeBoard(page, 'at', 'horizontal', { x: 7, y: 7 });
      await Lib.solve(page);

      await expect(Lib.getResult(page, 0)).toBeVisible();

      await Lib.openWordsModal(page);

      await expect(page.getByTestId('word-7-7-horizontal').getByLabel('Valid', { exact: true })).toBeVisible();
    });

    test('ends up with the results of the latest of overlapping solves', async ({ page }) => {
      await Lib.visitIndex(page);
      await Lib.typeBoard(page, 'i', 'horizontal', { x: 7, y: 7 });
      await Lib.typeRack(page, 'q');
      await Lib.waitForCachedDictionary(page);
      await page.keyboard.press('Enter');
      await Lib.getRackTile(page, 0).focus();
      await page.keyboard.type('x');
      await page.keyboard.press('Enter');

      await Lib.assertResult(page, 0, 'xi', 9);
      await expect(Lib.getResultsContainer(page)).toHaveAttribute('data-outdated', 'false');
    });

    test('downloads the dictionary of a newly picked language and solves with it', async ({ page }) => {
      await Lib.visitIndex(page);
      await Lib.openSettingsModal(page);
      await Lib.getSettingOption(page, 'Language', 'Polski').check();
      await Lib.closeModal(page);
      await Lib.waitForCachedDictionary(page, 'pl-PL');

      const solveRequests = Lib.trackRequests(page, '/api/solve');
      await Lib.typeRack(page, 'kot');
      await Lib.solve(page);

      await expect(Lib.getResult(page, 0)).toBeVisible();
      expect(solveRequests).toEqual([]);
    });

    for (const [locale, rack] of LOCALES) {
      test(`downloads, reads and solves with the ${locale} dictionary`, async ({ page }) => {
        await Lib.persistSettings(page, { game: 'scrabble', inputMode: 'keyboard', locale });
        await Lib.visitIndex(page);
        await page.keyboard.press('Shift');
        await Lib.waitForCachedDictionary(page, locale);
        const solveRequests = Lib.trackRequests(page, '/api/solve');
        await Lib.typeRack(page, rack);
        await Lib.solve(page);

        await expect(Lib.getResult(page, 0)).toBeVisible();
        expect(solveRequests).toEqual([]);
      });
    }
  });

  test.describe('dictionary cache', () => {
    test('stores the dictionary decompressed, although the server sent it compressed', async ({ page, request }) => {
      const plainDictionary = await request.get('/api/dictionary/en-US', {
        headers: { 'Accept-Encoding': 'identity' },
      });
      await Lib.visitIndex(page);
      await page.keyboard.press('Shift');
      await Lib.waitForCachedDictionary(page);

      expect(await page.evaluate(readCachedDictionaryLength)).toBe((await plainDictionary.body()).byteLength);
    });

    test('revalidates with the stored ETag and keeps the body on a 304', async ({ page }) => {
      await Lib.visitIndex(page);
      await page.keyboard.press('Shift');
      await Lib.waitForCachedDictionary(page);
      await page.evaluate(() => caches.delete('dictionary-revalidated-at'));
      const revalidation = page.waitForResponse('**/api/dictionary/en-US');
      await page.reload();
      await page.keyboard.press('Shift');

      expect((await revalidation).status()).toBe(304);
      expect(await Lib.isDictionaryCached(page)).toBe(true);
    });

    test('replaces a dictionary it cannot read, and solves through the server meanwhile', async ({ page }) => {
      await Lib.visitIndex(page);
      await page.keyboard.press('Shift');
      await Lib.waitForCachedDictionary(page);
      await page.evaluate(async () => {
        const cache = await caches.open('dictionary-api-cache');
        await cache.put('/api/dictionary/en-US', new Response('corrupt', { headers: { etag: '"corrupt"' } }));
      });
      await page.reload();
      await Lib.typeBoard(page, 'i', 'horizontal', { x: 7, y: 7 });
      await Lib.typeRack(page, 'q');
      await Lib.solve(page);

      await Lib.assertResult(page, 0, 'qi', 11);
      await expect
        .poll(() => page.evaluate(readCachedDictionaryLength), { timeout: 60_000 })
        .toBeGreaterThan('corrupt'.length);
    });
  });

  test.describe('when nothing can answer', () => {
    test('shows the server error and recovers on the next solve', async ({ page }) => {
      await page.route('**/api/dictionary/*', (route) => route.fulfill({ status: 503 }));
      await page.route('**/api/solve', (route) => route.fulfill({ json: { message: 'Solver is down' }, status: 500 }));
      await solveQi(page);

      await expect(Lib.getResultsContainer(page)).toContainText('Solver is down');

      await page.unroute('**/api/solve');
      await Lib.getRackTile(page).press('Enter');

      await Lib.assertResult(page, 0, 'qi', 11);
    });

    test('shows the status of a proxy that answers with a web page', async ({ page }) => {
      await page.route('**/api/dictionary/*', (route) => route.fulfill({ status: 503 }));
      await page.route('**/api/solve', (route) => {
        return route.fulfill({ body: '<html>Bad Gateway</html>', status: 502 });
      });
      await solveQi(page);

      await expect(Lib.getResultsContainer(page)).toContainText('HTTP 502');
    });

    test('reports a lost connection', async ({ context, page }) => {
      await page.route('**/api/dictionary/*', (route) => route.fulfill({ status: 503 }));
      await Lib.visitIndex(page);
      await Lib.typeBoard(page, 'i', 'horizontal', { x: 7, y: 7 });
      await Lib.typeRack(page, 'q');
      await context.setOffline(true);
      await Lib.getRackTile(page).press('Enter');

      await expect(Lib.getResultsContainer(page)).toContainText('Network error');
    });
  });
});

function byNumber(a: number, b: number): number {
  return a - b;
}

async function solveQi(page: Page): Promise<void> {
  await Lib.visitIndex(page);
  await Lib.typeBoard(page, 'i', 'horizontal', { x: 7, y: 7 });
  await Lib.typeRack(page, 'q');
  await Lib.getRackTile(page).press('Enter');
}

async function readCachedDictionaryLength(): Promise<number> {
  const cache = await caches.open('dictionary-api-cache');
  const response = await cache.match('/api/dictionary/en-US');

  return (await response?.arrayBuffer())?.byteLength ?? 0;
}
