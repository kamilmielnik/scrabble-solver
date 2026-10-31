import { type Page, expect, test } from '@playwright/test';

import * as Lib from '../lib';

const getTabs = (page: Page) => page.locator('[role=tablist] [role=tab]');

const getBoardLetters = (page: Page) =>
  page.evaluate(() => {
    const inputs = Array.from(document.querySelectorAll('[data-testid=board] input')) as HTMLInputElement[];
    return inputs
      .map((input) => input.value)
      .filter((value) => value.trim().length > 0)
      .join('');
  });

/**
 * Writes storage exactly as the single-board version of the app left it: a
 * `board` key holding a stringified BoardJson, and a `rack` key.
 */
function seedLegacyBoard(): void {
  const word = 'hello';
  const rows = [];

  for (let y = 0; y < 15; ++y) {
    const row = [];

    for (let x = 0; x < 15; ++x) {
      const isWord = y === 7 && x >= 5 && x < 5 + word.length;
      row.push(
        isWord
          ? { isEmpty: false, tile: { character: word[x - 5], isBlank: false }, x, y }
          : { isEmpty: true, tile: null, x, y },
      );
    }

    rows.push(row);
  }

  localStorage.setItem('scrabble-solver.board', JSON.stringify(JSON.stringify(rows)));
  localStorage.setItem('scrabble-solver.rack', JSON.stringify(['a', 'b', null, null, null, null, null]));
}

test.describe('Multiple boards', () => {
  test.beforeEach(async ({ page }) => {
    await Lib.preferKeyboardInput(page);
  });

  test('keeps each board separate, and comes back to the one last in play', async ({ page }) => {
    await Lib.visitIndex(page);
    await expect(getTabs(page)).toHaveText(['Board 1']);

    await Lib.typeBoard(page, 'cat', 'horizontal', { x: 3, y: 3 });
    await page.getByRole('button', { name: 'New board' }).click();

    await expect(getTabs(page)).toHaveText(['Board 1', 'Board 2']);
    // A new board starts empty rather than inheriting what was on screen.
    await expect.poll(() => getBoardLetters(page)).toBe('');

    await Lib.typeBoard(page, 'dog', 'horizontal', { x: 5, y: 5 });
    await getTabs(page).first().click();
    await expect.poll(() => getBoardLetters(page)).toBe('cat');

    await getTabs(page).nth(1).click();
    await expect.poll(() => getBoardLetters(page)).toBe('dog');

    await page.reload();
    await expect(getTabs(page)).toHaveText(['Board 1', 'Board 2']);
    await expect.poll(() => getBoardLetters(page)).toBe('dog');
  });

  test('renames a board, and keeps the name across a reload', async ({ page }) => {
    await Lib.visitIndex(page);
    await page.getByRole('button', { name: 'Rename this board' }).click();
    await page.keyboard.type('Anna');
    await page.keyboard.press('Enter');

    await expect(getTabs(page)).toHaveText(['Anna']);

    await page.reload();
    await expect(getTabs(page)).toHaveText(['Anna']);
  });

  test('abandons a rename on Escape', async ({ page }) => {
    await Lib.visitIndex(page);
    await page.getByRole('button', { name: 'Rename this board' }).click();
    await page.keyboard.type('Discarded');
    await page.keyboard.press('Escape');

    await expect(getTabs(page)).toHaveText(['Board 1']);
  });

  test('removes a board with something on it only after confirming', async ({ page }) => {
    await Lib.visitIndex(page);
    await Lib.typeBoard(page, 'cat', 'horizontal', { x: 3, y: 3 });
    await page.getByRole('button', { name: 'New board' }).click();
    await Lib.typeBoard(page, 'dog', 'horizontal', { x: 5, y: 5 });

    await page.getByRole('button', { name: 'Remove this board' }).click();
    await expect(page.getByRole('dialog')).toContainText('Remove this board and everything on it?');
    // Still there until the question is answered.
    await expect(getTabs(page)).toHaveText(['Board 1', 'Board 2']);

    await page.getByRole('dialog').getByRole('button', { name: 'Remove', exact: true }).click();

    await expect(getTabs(page)).toHaveText(['Board 1']);
    await expect.poll(() => getBoardLetters(page)).toBe('cat');
  });

  test('keeps the board when the confirmation is cancelled', async ({ page }) => {
    await Lib.visitIndex(page);
    await page.getByRole('button', { name: 'New board' }).click();
    await Lib.typeBoard(page, 'dog', 'horizontal', { x: 5, y: 5 });

    await page.getByRole('button', { name: 'Remove this board' }).click();
    await page.getByRole('dialog').getByRole('button', { name: 'Cancel' }).click();

    await expect(page.getByRole('dialog')).toHaveCount(0);
    await expect(getTabs(page)).toHaveText(['Board 1', 'Board 2']);
    await expect.poll(() => getBoardLetters(page)).toBe('dog');
  });

  test('abandons the confirmation on Escape', async ({ page }) => {
    await Lib.visitIndex(page);
    await page.getByRole('button', { name: 'New board' }).click();
    await Lib.typeBoard(page, 'dog', 'horizontal', { x: 5, y: 5 });

    await page.getByRole('button', { name: 'Remove this board' }).click();
    await expect(page.getByRole('dialog')).toBeVisible();
    await page.keyboard.press('Escape');

    await expect(page.getByRole('dialog')).toHaveCount(0);
    await expect(getTabs(page)).toHaveText(['Board 1', 'Board 2']);
  });

  test('removes an empty board without asking', async ({ page }) => {
    await Lib.visitIndex(page);
    await Lib.typeBoard(page, 'cat', 'horizontal', { x: 3, y: 3 });
    await page.getByRole('button', { name: 'New board' }).click();

    // Nothing on the new board, so there is nothing to lose and nothing to ask.
    await page.getByRole('button', { name: 'Remove this board' }).click();

    await expect(page.getByRole('dialog')).toHaveCount(0);
    await expect(getTabs(page)).toHaveText(['Board 1']);
    await expect.poll(() => getBoardLetters(page)).toBe('cat');
  });

  test('asks when the board is empty but the rack is not', async ({ page }) => {
    await Lib.visitIndex(page);
    await page.getByRole('button', { name: 'New board' }).click();
    await Lib.typeRack(page, 'abc');

    await page.getByRole('button', { name: 'Remove this board' }).click();

    await expect(page.getByRole('dialog')).toBeVisible();
  });

  test('offers no way to remove the only board', async ({ page }) => {
    await Lib.visitIndex(page);

    await expect(page.getByRole('button', { name: 'Remove this board' })).toHaveCount(0);
  });

  test('renumbers the default labels when a board is removed', async ({ page }) => {
    await Lib.visitIndex(page);
    await page.getByRole('button', { name: 'New board' }).click();
    await page.getByRole('button', { name: 'New board' }).click();
    await expect(getTabs(page)).toHaveText(['Board 1', 'Board 2', 'Board 3']);

    await getTabs(page).nth(1).click();
    await page.getByRole('button', { name: 'Remove this board' }).click();

    // Labels follow position, so no gap is left behind.
    await expect(getTabs(page)).toHaveText(['Board 1', 'Board 2']);
  });

  test('migrates a board saved before tabs existed', async ({ page }) => {
    await page.addInitScript(seedLegacyBoard);

    await Lib.visitIndex(page);

    await expect(getTabs(page)).toHaveText(['Board 1']);
    await expect.poll(() => getBoardLetters(page)).toBe('hello');

    // The legacy keys are consumed, so the migration cannot run twice and
    // overwrite whatever the user does next.
    const keys = await page.evaluate(() => Object.keys(localStorage));
    expect(keys).not.toContain('scrabble-solver.board');
    expect(keys).not.toContain('scrabble-solver.rack');
    expect(keys).toContain('scrabble-solver.board:board-1');
  });
});
