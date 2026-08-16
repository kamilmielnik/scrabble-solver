import { expect, type Page, test } from '@playwright/test';

import * as Lib from '../lib';

/*
 * @see https://github.com/kamilmielnik/scrabble-solver/issues/427
 */
test.describe('#427 - Highlight created words on board on hover', () => {
  test('highlights the hovered word only at its own position', async ({ page }) => {
    await Lib.visitIndex(page);
    await Lib.typeBoard(page, 'cat', 'horizontal', { x: 3, y: 3 });
    await Lib.typeBoard(page, 'cat', 'vertical', { x: 8, y: 8 });
    await openWordsModal(page);

    await page.getByTestId('word-3-3-horizontal').hover();
    await Lib.expectTileHighlighted(Lib.getBoardTile(page, 3, 3));
    await Lib.expectTileHighlighted(Lib.getBoardTile(page, 4, 3));
    await Lib.expectTileHighlighted(Lib.getBoardTile(page, 5, 3));
    await Lib.expectTileNotHighlighted(Lib.getBoardTile(page, 8, 8));
    await Lib.expectTileNotHighlighted(Lib.getBoardTile(page, 8, 9));
    await Lib.expectTileNotHighlighted(Lib.getBoardTile(page, 8, 10));

    await page.getByTestId('word-8-8-vertical').hover();
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
    await openWordsModal(page);

    await Lib.getOpenModal(page).getByLabel('Invalid', { exact: true }).getByTestId('word-5-5-horizontal').hover();
    await Lib.expectTileHighlighted(Lib.getBoardTile(page, 5, 5));
    await Lib.expectTileHighlighted(Lib.getBoardTile(page, 6, 5));
    await Lib.expectTileHighlighted(Lib.getBoardTile(page, 7, 5));
    await Lib.expectTileNotHighlighted(Lib.getBoardTile(page, 8, 5));
  });

  test('clears the highlight when the modal closes', async ({ page }) => {
    await Lib.visitIndex(page);
    await Lib.typeBoard(page, 'cat', 'horizontal', { x: 3, y: 3 });
    await openWordsModal(page);

    await page.getByTestId('word-3-3-horizontal').hover();
    await Lib.expectTileHighlighted(Lib.getBoardTile(page, 3, 3));

    await page.keyboard.press('Escape');
    await expect(Lib.getOpenModal(page)).toHaveCount(0);
    await Lib.expectTileNotHighlighted(Lib.getBoardTile(page, 3, 3));
    await Lib.expectTileNotHighlighted(Lib.getBoardTile(page, 4, 3));
    await Lib.expectTileNotHighlighted(Lib.getBoardTile(page, 5, 3));
  });
});

async function openWordsModal(page: Page) {
  await page.getByLabel('Created words', { exact: true }).click();
  await expect(Lib.getOpenModal(page)).toBeVisible();
}
