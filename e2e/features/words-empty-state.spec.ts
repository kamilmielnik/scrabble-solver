import { expect, test } from '@playwright/test';

import * as Lib from '../lib';

test.describe('Words empty state', () => {
  test('shows an empty state and no search input when the board holds no words', async ({ page }) => {
    await Lib.visitIndex(page);
    await Lib.openWordsModal(page);
    const modal = Lib.getOpenModal(page);

    await expect(modal.getByText('No created words - the board is empty.', { exact: true })).toBeVisible();
    await expect(Lib.getWordsFilterInput(page)).toHaveCount(0);
    await expect(Lib.getWord(page, 0)).toHaveCount(0);
  });

  test('replaces the empty state with the table once a word exists', async ({ page }) => {
    await Lib.visitIndex(page);
    await Lib.typeBoard(page, 'cat', 'horizontal', { x: 3, y: 3 });
    await Lib.openWordsModal(page);
    const modal = Lib.getOpenModal(page);

    await expect(modal.getByText('No created words - the board is empty.', { exact: true })).toHaveCount(0);
    await Lib.assertWord(page, 0, 'cat');
    await expect(Lib.getWordsFilterInput(page)).toBeVisible();
  });

  test('returns to the empty state when the last word is removed from the board', async ({ page }) => {
    await Lib.visitIndex(page);
    await Lib.typeBoard(page, 'cat', 'horizontal', { x: 3, y: 3 });
    await Lib.openWordsModal(page);
    await Lib.assertWord(page, 0, 'cat');

    for (const x of [3, 4, 5]) {
      await Lib.getBoardTile(page, x, 3).focus();
      await page.keyboard.press('Delete');
    }

    await expect(
      Lib.getOpenModal(page).getByText('No created words - the board is empty.', { exact: true }),
    ).toBeVisible();
  });
});
