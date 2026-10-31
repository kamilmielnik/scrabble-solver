import { type Locator, type Page, expect, test } from '@playwright/test';

import * as Lib from '../lib';

test.describe('Touch screen', () => {
  test.use({ hasTouch: true, viewport: { width: 420, height: 900 } });

  test.beforeEach(async ({ page }) => {
    await Lib.routeDefinitions(page, ['a definition']);
    await Lib.visitIndex(page);
  });

  test.describe('board', () => {
    test('enters a word through the prompt, along the typing direction', async ({ page }) => {
      await openBoardPrompt(page, 3, 3);
      await getBoardPrompt(page).fill('CAT');
      await page.keyboard.press('Enter');

      await Lib.expectBoardCharacters(page, ['c', 'a', 't']);
      await expect(Lib.getBoardTile(page, 5, 3)).toHaveValue('t');
    });

    test('keeps the keyboard closed until the prompt opens', async ({ page }) => {
      await Lib.getBoardTile(page, 3, 3).tap();

      await expect(Lib.getBoardTile(page, 3, 3)).not.toBeFocused();
    });

    test('focuses the prompt with its text selected, so that typing replaces it', async ({ page }) => {
      await openBoardPrompt(page, 3, 3);
      await getBoardPrompt(page).fill('cat');
      await page.keyboard.press('Enter');
      await openBoardPrompt(page, 3, 3);

      await expect(getBoardPrompt(page)).toBeFocused();
      await page.keyboard.type('d');
      await page.keyboard.press('Enter');

      await Lib.expectBoardCharacters(page, ['d', 'a', 't']);
    });

    test('shows the prompt inside the window for the last cell of the board', async ({ page }) => {
      await openBoardPrompt(page, 14, 14);

      await expect(getBoardPrompt(page)).toBeInViewport({ ratio: 1 });
    });
  });

  test.describe('rack', () => {
    test('enters the rack through the prompt', async ({ page }) => {
      await getRackTileFace(page).tap();
      await getRackPrompt(page).fill('abc');
      await page.keyboard.press('Enter');

      await expect(Lib.getRackTile(page, 0)).toHaveValue('a');
      await expect(Lib.getRackTile(page, 2)).toHaveValue('c');
    });

    test('closes the prompt on a tap outside, without changing the rack', async ({ page }) => {
      await getRackTileFace(page).tap();
      await getRackPrompt(page).fill('abc');
      await page.getByRole('navigation').tap({ position: { x: 5, y: 5 } });

      await expect(getRackPrompt(page)).toHaveCount(0);
      await expect(Lib.getRackTile(page, 0)).toHaveValue('');
    });
  });

  test('solves, previews and inserts with taps alone', async ({ page }) => {
    await openBoardPrompt(page, 7, 7);
    await getBoardPrompt(page).fill('i');
    await page.keyboard.press('Enter');
    await getRackTileFace(page).tap();
    await getRackPrompt(page).fill('q');
    await page.keyboard.press('Enter');

    await expect(Lib.getResultCandidatePicker(page)).toContainText('qi');

    await page.getByRole('button', { name: 'Insert', exact: true }).tap();

    await Lib.expectBoardCharacters(page, ['q', 'i']);
    await expect(Lib.getRackTile(page)).toHaveValue('');
  });

  test('keeps the rack on screen, above the bottom of the page', async ({ page }) => {
    await expect(getRackTileFace(page)).toBeInViewport({ ratio: 1 });
  });

  test('leaves the rack working when the first tap lands on the autofocused tile', async ({ page }) => {
    await getRackTileFace(page).tap();

    await expect(getRackPrompt(page)).toBeFocused();
  });

  test('offers no input mode setting, because a touch device has one', async ({ page }) => {
    await Lib.openMenuModal(page);
    await Lib.openModal(page, Lib.getOpenModal(page).getByLabel('Settings', { exact: true }));

    await expect(Lib.getOpenModal(page).getByLabel('Input mode', { exact: true })).toHaveCount(0);
  });
});

async function openBoardPrompt(page: Page, x: number, y: number): Promise<void> {
  await Lib.getBoardTile(page, x, y).locator('..').tap();
  await page.getByRole('button', { name: 'Enter word', exact: true }).tap();
}

function getBoardPrompt(page: Page): Locator {
  return page.getByPlaceholder('Letters', { exact: true });
}

function getRackPrompt(page: Page): Locator {
  return page.getByPlaceholder('Letters…', { exact: true });
}

/**
 * The input of a rack tile is deliberately larger than the tile, so its center lies over the board.
 */
function getRackTileFace(page: Page): Locator {
  return Lib.getRackTile(page).locator('..');
}
