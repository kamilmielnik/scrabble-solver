import { type Page, expect, test } from '@playwright/test';

import * as Lib from '../lib';

test.describe('Offline', () => {
  test.use({ serviceWorkers: 'allow' });

  test.skip(({ baseURL }) => !baseURL?.includes(':3333'), 'The service worker exists only in production builds');

  test.beforeEach(async ({ page }) => {
    await Lib.preferKeyboardInput(page);
    await Lib.visitIndex(page);
    await waitForServiceWorker(page);
  });

  test('activates the service worker, which only happens if its whole precache installed', async ({ page }) => {
    expect(await page.evaluate(readServiceWorkerState)).toBe('activated');
    expect(await page.evaluate(() => caches.keys())).toContain('app-shell');
  });

  test('styles a modal offline from the precache, even after the HTTP cache is cleared', async ({ context, page }) => {
    await page.keyboard.press('Shift');
    await Lib.waitForCachedDictionary(page);
    const session = await context.newCDPSession(page);
    await session.send('Network.clearBrowserCache');
    await context.setOffline(true);
    await page.reload();
    await Lib.openSettingsModal(page);

    await expect(Lib.getOpenModal(page)).toHaveCSS('position', 'fixed');
  });

  test.describe('after the connection drops', () => {
    test.beforeEach(async ({ context, page }) => {
      await page.keyboard.press('Shift');
      await Lib.waitForCachedDictionary(page);
      await context.setOffline(true);
      await page.reload();
    });

    test('reloads the app from the cached shell', async ({ page }) => {
      await expect(Lib.getBoardContainer(page)).toBeVisible();
      await expect(page).toHaveTitle('Scrabble Solver 2 - Board Solver & Word Finder');
    });

    test('solves and verifies from the cached dictionary', async ({ page }) => {
      await Lib.typeBoard(page, 'at', 'horizontal', { x: 7, y: 7 });
      await Lib.typeRack(page, 's');
      await Lib.solve(page);

      await expect(Lib.getResult(page, 0)).toBeVisible();

      await Lib.openWordsModal(page);

      await expect(page.getByTestId('word-7-7-horizontal').getByLabel('Valid', { exact: true })).toBeVisible();
    });

    test('opens a modal, because its chunk is precached', async ({ page }) => {
      await Lib.openSettingsModal(page);

      await expect(Lib.getSettingOption(page, 'Game', 'Scrabble')).toBeChecked();
    });

    test('switches the language, because translations are precached', async ({ page }) => {
      await Lib.openSettingsModal(page);
      await Lib.getSettingOption(page, 'Language', 'Polski').check();
      await Lib.closeModal(page);

      await expect(page.locator('html')).toHaveAttribute('lang', 'pl-PL');
      await expect(page.getByRole('button', { name: 'Wyczyść', exact: true })).toBeVisible();
    });

    test('reports a failed lookup in the dictionary panel and keeps solving', async ({ page }) => {
      await Lib.getDictionaryInput(page).fill('cat');
      await Lib.getDictionaryInput(page).press('Enter');

      await expect(Lib.getDictionary(page)).toContainText('Network error');

      await Lib.typeRack(page, 'cat');
      await Lib.solve(page);

      await expect(Lib.getResult(page, 0)).toBeVisible();
    });

    test('never answers an API navigation with the app shell', async ({ page }) => {
      await expect(page.goto('/api/visit')).rejects.toThrow();
    });
  });
});

async function waitForServiceWorker(page: Page): Promise<void> {
  await expect.poll(() => page.evaluate(isServiceWorkerInControl), { timeout: 30_000 }).toBe(true);
}

async function isServiceWorkerInControl(): Promise<boolean> {
  const registration = await navigator.serviceWorker.getRegistration();

  return registration?.active?.state === 'activated' && navigator.serviceWorker.controller !== null;
}

async function readServiceWorkerState(): Promise<string | undefined> {
  return (await navigator.serviceWorker.getRegistration())?.active?.state;
}
