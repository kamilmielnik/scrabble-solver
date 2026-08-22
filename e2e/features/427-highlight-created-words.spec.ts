import { expect, test } from '@playwright/test';

import * as Lib from '../lib';

/*
 * @see https://github.com/kamilmielnik/scrabble-solver/issues/427
 */
test.describe('#427 - Highlight created words on board on hover', () => {
  test('highlights the hovered word only at its own position', async ({ page }) => {
    await Lib.visitIndex(page);
    await Lib.typeBoard(page, 'cat', 'horizontal', { x: 3, y: 3 });
    await Lib.typeBoard(page, 'cat', 'vertical', { x: 8, y: 8 });
    await Lib.openWordsModal(page);

    await Lib.hoverWord(page, 3, 3, 'horizontal');
    await Lib.expectTileHighlighted(Lib.getBoardTile(page, 3, 3));
    await Lib.expectTileHighlighted(Lib.getBoardTile(page, 4, 3));
    await Lib.expectTileHighlighted(Lib.getBoardTile(page, 5, 3));
    await Lib.expectTileNotHighlighted(Lib.getBoardTile(page, 8, 8));
    await Lib.expectTileNotHighlighted(Lib.getBoardTile(page, 8, 9));
    await Lib.expectTileNotHighlighted(Lib.getBoardTile(page, 8, 10));

    await Lib.hoverWord(page, 8, 8, 'vertical');
    await Lib.expectTileNotHighlighted(Lib.getBoardTile(page, 3, 3));
    await Lib.expectTileNotHighlighted(Lib.getBoardTile(page, 4, 3));
    await Lib.expectTileNotHighlighted(Lib.getBoardTile(page, 5, 3));
    await Lib.expectTileHighlighted(Lib.getBoardTile(page, 8, 8));
    await Lib.expectTileHighlighted(Lib.getBoardTile(page, 8, 9));
    await Lib.expectTileHighlighted(Lib.getBoardTile(page, 8, 10));

    await Lib.moveMouseAway(page);
    await Lib.expectTileNotHighlighted(Lib.getBoardTile(page, 3, 3));
    await Lib.expectTileNotHighlighted(Lib.getBoardTile(page, 4, 3));
    await Lib.expectTileNotHighlighted(Lib.getBoardTile(page, 5, 3));
    await Lib.expectTileNotHighlighted(Lib.getBoardTile(page, 8, 8));
    await Lib.expectTileNotHighlighted(Lib.getBoardTile(page, 8, 9));
    await Lib.expectTileNotHighlighted(Lib.getBoardTile(page, 8, 10));
  });

  test('highlights a hovered invalid word', async ({ page }) => {
    await Lib.visitIndex(page);
    await Lib.typeBoard(page, 'zvq', 'horizontal', { x: 5, y: 5 });
    await Lib.openWordsModal(page);

    await expect(page.getByTestId('word-5-5-horizontal').getByLabel('Invalid', { exact: true })).toBeVisible();
    await Lib.hoverWord(page, 5, 5, 'horizontal');
    await Lib.expectTileHighlighted(Lib.getBoardTile(page, 5, 5));
    await Lib.expectTileHighlighted(Lib.getBoardTile(page, 6, 5));
    await Lib.expectTileHighlighted(Lib.getBoardTile(page, 7, 5));
    await Lib.expectTileNotHighlighted(Lib.getBoardTile(page, 8, 5));
  });

  test('clears the highlight when the modal closes', async ({ page }) => {
    await Lib.visitIndex(page);
    await Lib.typeBoard(page, 'cat', 'horizontal', { x: 3, y: 3 });
    await Lib.openWordsModal(page);

    await Lib.hoverWord(page, 3, 3, 'horizontal');
    await Lib.expectTileHighlighted(Lib.getBoardTile(page, 3, 3));

    await page.keyboard.press('Escape');
    await expect(Lib.getOpenModal(page)).toHaveCount(0);
    await Lib.expectTileNotHighlighted(Lib.getBoardTile(page, 3, 3));
    await Lib.expectTileNotHighlighted(Lib.getBoardTile(page, 4, 3));
    await Lib.expectTileNotHighlighted(Lib.getBoardTile(page, 5, 3));
  });

  test.describe('narrow enough to select the first word', () => {
    test.use({ viewport: { width: 800, height: 900 } });

    test('highlights the clicked word and keeps it highlighted when the pointer leaves', async ({ page }) => {
      await Lib.visitIndex(page);
      await Lib.typeBoard(page, 'cat', 'horizontal', { x: 3, y: 3 });
      await Lib.typeBoard(page, 'dog', 'horizontal', { x: 3, y: 5 });
      await Lib.openWordsModal(page);

      await page.getByTestId('word-3-5-horizontal').click();
      await Lib.expectTileHighlighted(Lib.getBoardTile(page, 3, 5));
      await Lib.expectTileNotHighlighted(Lib.getBoardTile(page, 3, 3));

      await Lib.moveMouseAway(page);
      await Lib.expectTileHighlighted(Lib.getBoardTile(page, 3, 5));
      await Lib.expectTileNotHighlighted(Lib.getBoardTile(page, 3, 3));
    });
  });
});
