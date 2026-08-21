import { expect, test } from '@playwright/test';

import * as Lib from '../lib';

test.describe('Words preview', () => {
  test.use({ hasTouch: true, viewport: { width: 800, height: 900 } });

  test.beforeEach(async ({ page }) => {
    await Lib.preferKeyboardInput(page);
  });

  test('selects the first word on open and previews the selected word on the board', async ({ page }) => {
    await Lib.visitIndex(page);
    await Lib.typeBoard(page, 'cat', 'horizontal', { x: 3, y: 3 });
    await Lib.typeBoard(page, 'dog', 'horizontal', { x: 3, y: 5 });
    await Lib.openWordsModal(page);

    await expect(Lib.getWord(page, 0)).toHaveAttribute('aria-current', 'true');

    await Lib.getWord(page, 1).click();
    await expect(Lib.getWord(page, 1)).toHaveAttribute('aria-current', 'true');
    await expect(Lib.getWord(page, 0)).not.toHaveAttribute('aria-current');

    await Lib.getOpenModal(page).getByRole('button', { name: 'Preview', exact: true }).click();
    await expect(Lib.getOpenModal(page)).toHaveCount(0);
    await Lib.expectTileHighlighted(Lib.getBoardTile(page, 3, 5));
    await Lib.expectTileHighlighted(Lib.getBoardTile(page, 4, 5));
    await Lib.expectTileHighlighted(Lib.getBoardTile(page, 5, 5));
    await Lib.expectTileNotHighlighted(Lib.getBoardTile(page, 3, 3));
  });

  test('highlights either the result candidate or the selected word, never both', async ({ page }) => {
    await Lib.visitIndex(page);
    await Lib.typeBoard(page, 'cat', 'horizontal', { x: 3, y: 3 });
    await Lib.typeRack(page, 's');
    await Lib.solve(page);

    await Lib.openWordsModal(page);
    await Lib.getOpenModal(page).getByRole('button', { name: 'Preview', exact: true }).click();
    await Lib.expectTileHighlighted(Lib.getBoardTile(page, 3, 3));

    await page.getByRole('button', { name: 'Results', exact: true }).click();
    const result = Lib.getOpenModal(page).getByTestId('result').first();
    await expect(result).not.toHaveAttribute('aria-current');
    await result.click();
    await Lib.expectTileNotHighlighted(Lib.getBoardTile(page, 3, 3));
  });

  test('clears the highlights when the layout breakpoint changes', async ({ page }) => {
    await Lib.visitIndex(page);
    await Lib.typeBoard(page, 'cat', 'horizontal', { x: 3, y: 3 });
    await Lib.openWordsModal(page);
    await Lib.getOpenModal(page).getByRole('button', { name: 'Preview', exact: true }).click();
    await Lib.expectTileHighlighted(Lib.getBoardTile(page, 3, 3));

    await page.setViewportSize({ width: 1280, height: 900 });
    await Lib.expectTileNotHighlighted(Lib.getBoardTile(page, 3, 3));
  });

  test('drops the highlight when the modal is closed without previewing', async ({ page }) => {
    await Lib.visitIndex(page);
    await Lib.typeBoard(page, 'cat', 'horizontal', { x: 3, y: 3 });
    await Lib.openWordsModal(page);
    await expect(Lib.getWord(page, 0)).toHaveAttribute('aria-current', 'true');

    await page.keyboard.press('Escape');
    await expect(Lib.getOpenModal(page)).toHaveCount(0);
    await Lib.expectTileNotHighlighted(Lib.getBoardTile(page, 3, 3));
    await Lib.expectTileNotHighlighted(Lib.getBoardTile(page, 4, 3));
    await Lib.expectTileNotHighlighted(Lib.getBoardTile(page, 5, 3));
  });

  test('drops the selection when the selected word is edited on the board', async ({ page }) => {
    await Lib.visitIndex(page);
    await Lib.typeBoard(page, 'cat', 'horizontal', { x: 3, y: 3 });
    await Lib.typeBoard(page, 'dog', 'horizontal', { x: 3, y: 5 });
    await Lib.openWordsModal(page);
    await Lib.getWord(page, 1).click();
    await expect(Lib.getWord(page, 1)).toHaveAttribute('aria-current', 'true');

    await Lib.getBoardTile(page, 3, 5).focus();
    await page.keyboard.type('z');

    await expect(page.getByTestId('word-3-5-horizontal')).toHaveAttribute('aria-label', 'zog');
    await expect(page.getByTestId('word-3-5-horizontal')).not.toHaveAttribute('aria-current');
    await Lib.expectTileNotHighlighted(Lib.getBoardTile(page, 3, 5));
  });

  test.describe('wide enough not to select the first word', () => {
    test.use({ viewport: { width: 1280, height: 900 } });

    test('forgets the previewed word when the board is cleared', async ({ page }) => {
      await Lib.visitIndex(page);
      await Lib.typeBoard(page, 'zvq', 'horizontal', { x: 3, y: 3 });
      await Lib.openWordsModal(page);
      await Lib.getWord(page, 0).click();
      await Lib.getOpenModal(page).getByRole('button', { name: 'Preview', exact: true }).click();
      await Lib.expectTileHighlighted(Lib.getBoardTile(page, 3, 3));

      await page.getByRole('button', { name: 'Clear', exact: true }).click();
      await Lib.typeBoard(page, 'zvq', 'horizontal', { x: 3, y: 3 });
      await Lib.openWordsModal(page);

      await expect(Lib.getWord(page, 0)).toHaveAttribute('aria-label', 'zvq');
      await expect(Lib.getWord(page, 0)).not.toHaveAttribute('aria-current');
      await Lib.expectTileNotHighlighted(Lib.getBoardTile(page, 3, 3));
    });
  });

  test.describe('without touch', () => {
    test.use({ hasTouch: false });

    test('offers no preview button', async ({ page }) => {
      await Lib.visitIndex(page);
      await Lib.typeBoard(page, 'cat', 'horizontal', { x: 3, y: 3 });
      await Lib.openWordsModal(page);

      await expect(Lib.getOpenModal(page).getByRole('button', { name: 'Preview', exact: true })).toHaveCount(0);
    });

    test('keeps the word selected when its row is clicked again', async ({ page }) => {
      await Lib.visitIndex(page);
      await Lib.typeBoard(page, 'cat', 'horizontal', { x: 3, y: 3 });
      await Lib.typeBoard(page, 'dog', 'horizontal', { x: 3, y: 5 });
      await Lib.openWordsModal(page);

      await Lib.getWord(page, 1).click();
      await expect(Lib.getWord(page, 1)).toHaveAttribute('aria-current', 'true');

      await Lib.getWord(page, 1).click();
      await expect(Lib.getWord(page, 1)).toHaveAttribute('aria-current', 'true');
      await expect(Lib.getWord(page, 0)).not.toHaveAttribute('aria-current');
    });
  });

  test.describe('phone', () => {
    test.use({ viewport: { width: 420, height: 900 } });

    test('previewing from the menu-opened modal returns to the board', async ({ page }) => {
      await Lib.visitIndex(page);
      await Lib.typeBoard(page, 'cat', 'horizontal', { x: 3, y: 3 });
      await page.getByRole('button', { name: 'Menu', exact: true }).click();
      await Lib.getOpenModal(page).getByLabel('Created words', { exact: true }).click();

      await expect(Lib.getWord(page, 0)).toHaveAttribute('aria-current', 'true');

      await page.getByRole('button', { name: 'Preview', exact: true }).click();
      await expect(Lib.getModal(page)).toHaveCount(0);
      await Lib.expectTileHighlighted(Lib.getBoardTile(page, 3, 3));
    });
  });
});
