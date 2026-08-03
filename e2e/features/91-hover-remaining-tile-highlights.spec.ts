import { expect, type Page, test } from '@playwright/test';

import {
  expectTileHighlighted,
  expectTileNotHighlighted,
  getBoardTile,
  getOpenModal,
  getRackTile,
  typeBoard,
  typeRack,
  visitIndex,
} from '../lib';

/*
 * @see https://github.com/kamilmielnik/scrabble-solver/issues/91
 */
test.describe('#91 - Hovering remaining tile highlights all same tiles on the board and rack', () => {
  test('highlights matching letter tiles on the board and rack', async ({ page }) => {
    await visitIndex(page);
    await typeBoard(page, 'cat', 'horizontal', { x: 7, y: 7 });
    await typeRack(page, 'aab ');
    await openRemainingTilesModal(page);

    await hoverRemainingTile(page, 'a');
    await expectTileHighlighted(getRackTile(page, 0));
    await expectTileHighlighted(getRackTile(page, 1));
    await expectTileNotHighlighted(getRackTile(page, 2));
    await expectTileNotHighlighted(getRackTile(page, 3));
    await expectTileNotHighlighted(getBoardTile(page, 7, 7));
    await expectTileHighlighted(getBoardTile(page, 8, 7));
    await expectTileNotHighlighted(getBoardTile(page, 9, 7));

    await hoverRemainingTile(page, 'b');
    await expectTileNotHighlighted(getRackTile(page, 0));
    await expectTileNotHighlighted(getRackTile(page, 1));
    await expectTileHighlighted(getRackTile(page, 2));
    await expectTileNotHighlighted(getRackTile(page, 3));
    await expectTileNotHighlighted(getBoardTile(page, 7, 7));
    await expectTileNotHighlighted(getBoardTile(page, 8, 7));
    await expectTileNotHighlighted(getBoardTile(page, 9, 7));
  });

  test('highlights matching blank tiles on the board and rack', async ({ page }) => {
    await visitIndex(page);
    await typeBoard(page, 'a', 'horizontal', { x: 7, y: 7 });
    await getBoardTile(page, 7, 7).focus();
    await typeBoard(page, ' ', 'horizontal', { x: 7, y: 7 });
    await typeRack(page, ' a');
    await openRemainingTilesModal(page);

    await hoverRemainingTile(page, ' ');
    await expectTileHighlighted(getRackTile(page, 0));
    await expectTileNotHighlighted(getRackTile(page, 1));
    await expectTileHighlighted(getBoardTile(page, 7, 7));

    await hoverRemainingTile(page, 'a');
    await expectTileNotHighlighted(getRackTile(page, 0));
    await expectTileHighlighted(getRackTile(page, 1));
    await expectTileNotHighlighted(getBoardTile(page, 7, 7));
  });

  test('does not highlight a remaining tile in the sidebar if it has not been used', async ({ page }) => {
    await visitIndex(page);
    await typeRack(page, 'a');
    await openRemainingTilesModal(page);

    await hoverRemainingTile(page, 'z');
    await expect(page.getByTestId('remaining-tile-z').locator('[role="mark"]')).toHaveCount(0);
    await expectTileNotHighlighted(getRackTile(page, 0));

    await hoverRemainingTile(page, 'a');
    await expect(page.getByTestId('remaining-tile-a').locator('[role="mark"]')).not.toHaveCount(0);
    await expectTileHighlighted(getRackTile(page, 0));
  });
});

const openRemainingTilesModal = async (page: Page) => {
  await page.getByLabel('Remaining tiles', { exact: true }).click();
  await expect(getOpenModal(page)).toBeVisible();
};

const hoverRemainingTile = async (page: Page, character: string) => {
  const testId = character === ' ' ? 'remaining-tile-blank' : `remaining-tile-${character}`;
  await page.getByTestId(testId).hover();
};
