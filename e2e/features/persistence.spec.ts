import { type Page, expect, test } from '@playwright/test';

import * as Lib from '../lib';

test.describe('Persistence across reloads', () => {
  test('keeps the board, the rack and blank tiles', async ({ page }) => {
    await Lib.visitIndex(page);
    await Lib.typeBoard(page, 'cat', 'horizontal', { x: 3, y: 3 });
    await Lib.typeRack(page, 'q ');
    await expectStored(page, 'rack', 'q');

    await page.reload();

    await Lib.expectBoardCharacters(page, ['c', 'a', 't']);
    await expect(Lib.getRackTile(page, 0)).toHaveValue('q');
    await expect(Lib.getRackTile(page, 1)).toHaveValue(' ');
  });

  test('verifies a restored board, without waiting for an edit', async ({ page }) => {
    await Lib.visitIndex(page);
    await Lib.typeBoard(page, 'zvq', 'horizontal', { x: 3, y: 3 });
    await expectStored(page, 'board', 'zvq'.at(0) ?? '');

    await page.reload();
    await Lib.openWordsModal(page);

    await expect(page.getByTestId('word-3-3-horizontal').getByLabel('Invalid', { exact: true })).toBeVisible();
  });

  test('keeps the game and the language, with their board and direction', async ({ page }) => {
    await Lib.visitIndex(page);
    await Lib.openSettingsModal(page);
    await Lib.getSettingOption(page, 'Language', 'فارسی').check();
    await Lib.closeModal(page);
    await expectStored(page, 'settings', 'fa-IR');

    await page.reload();

    await expect(page.locator('html')).toHaveAttribute('dir', 'rtl');
    await expect(page.locator('html')).toHaveAttribute('lang', 'fa-IR');
    await expect(Lib.getBoardContainer(page).getByRole('textbox', { includeHidden: true })).toHaveCount(225);
  });

  test.describe('language chunks', () => {
    test('shows a remembered language from the cache, even if its chunk cannot load', async ({ page }) => {
      await Lib.persistSettings(page, { game: 'scrabble', inputMode: 'keyboard', locale: 'pl-PL' });
      await Lib.visitIndex(page);
      await expectStored(page, 'translations', 'pl-PL');
      await blockLazyChunks(page);

      await page.reload();

      await expect(page.getByRole('button', { name: 'Wyczyść', exact: true })).toBeVisible();
    });

    test('falls back to English, and keeps working, when the chunk of a language fails', async ({ page }) => {
      await Lib.persistSettings(page, { game: 'scrabble', inputMode: 'keyboard', locale: 'pl-PL' });
      await blockLazyChunks(page);
      await Lib.visitIndex(page);
      await Lib.typeRack(page, 'k');

      await expect(page.getByRole('button', { name: 'Clear', exact: true })).toBeVisible();
      await expect(Lib.getRackTile(page)).toHaveValue('k');
    });
  });

  test('forgets what Clear removed', async ({ page }) => {
    await Lib.visitIndex(page);
    await Lib.typeBoard(page, 'cat', 'horizontal', { x: 3, y: 3 });
    await Lib.typeRack(page, 'q');
    await page.getByRole('button', { name: 'Clear', exact: true }).click();
    await Lib.expectBoardCharacters(page, []);

    await page.reload();

    await Lib.expectBoardCharacters(page, []);
    await expect(Lib.getRackTile(page)).toHaveValue('');
  });

  test('shares the board with a tab opened later', async ({ context, page }) => {
    await Lib.visitIndex(page);
    await Lib.typeBoard(page, 'cat', 'horizontal', { x: 3, y: 3 });
    await expectStored(page, 'board', 'c');

    const secondTab = await context.newPage();
    await Lib.visitIndex(secondTab);

    await Lib.expectBoardCharacters(secondTab, ['c', 'a', 't']);
  });

  test('writes nothing back on a boot with empty storage', async ({ page }) => {
    await Lib.visitIndexUntilIdle(page);

    expect(await readStorageKeys(page)).not.toContain('scrabble-solver.board');
  });

  test.describe('damaged storage', () => {
    // Blocking service workers makes register() resolve to nothing, which workbox-window trips over.
    test.use({ serviceWorkers: 'allow' });

    for (const [name, key, value] of [
      ['a corrupt board', 'scrabble-solver.board', '"{ corrupt"'],
      ['a rack that is not a list', 'scrabble-solver.rack', '{"a":1}'],
      ['settings that are not an object', 'scrabble-solver.settings', '"text"'],
      ['translations that are not an object', 'scrabble-solver.translations', '"text"'],
    ] as const) {
      test(`boots with ${name} and drops it`, async ({ page }) => {
        const problems = Lib.trackPageProblems(page);

        await page.addInitScript(
          ([storageKey, storageValue]) => {
            if (sessionStorage.getItem('e2e-seeded') === null) {
              sessionStorage.setItem('e2e-seeded', 'true');
              localStorage.setItem(storageKey, storageValue);
            }
          },
          [key, value],
        );
        await Lib.visitIndex(page);
        await Lib.typeRack(page, 'a');

        await expect(Lib.getRackTile(page)).toHaveValue('a');
        expect(await page.evaluate((storageKey) => localStorage.getItem(storageKey), key)).not.toBe(value);
        expect(problems).toEqual([]);
      });
    }

    test('boots and works when the browser refuses access to storage', async ({ page }) => {
      await page.addInitScript(() => {
        Object.defineProperty(window, 'localStorage', {
          get() {
            throw new DOMException('Access denied', 'SecurityError');
          },
        });
      });
      await Lib.visitIndex(page);
      await Lib.typeBoard(page, 'i', 'horizontal', { x: 7, y: 7 });
      await Lib.typeRack(page, 'q');
      await Lib.solve(page);

      await Lib.assertResult(page, 0, 'qi', 11);
    });
  });
});

/**
 * Chunks the document does not reference load lazily, which is how translations and modals arrive.
 */
async function blockLazyChunks(page: Page): Promise<void> {
  const documentHtml = await (await page.request.get('/')).text();

  await page.route('**/_next/static/chunks/**', async (route) => {
    const isInDocument = documentHtml.includes(new URL(route.request().url()).pathname);

    await (isInDocument ? route.continue() : route.abort());
  });
}

async function expectStored(page: Page, key: string, text: string): Promise<void> {
  await expect
    .poll(() => page.evaluate((storageKey) => localStorage.getItem(storageKey) ?? '', `scrabble-solver.${key}`))
    .toContain(text);
}

function readStorageKeys(page: Page): Promise<string[]> {
  return page.evaluate(() => Object.keys(localStorage));
}
