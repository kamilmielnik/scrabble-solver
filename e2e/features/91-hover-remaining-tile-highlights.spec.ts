import { expect, type Page, test } from '@playwright/test';

import * as Lib from '../lib';

/*
 * @see https://github.com/kamilmielnik/scrabble-solver/issues/91
 */
test.describe('#91 - Hovering remaining tile highlights all same tiles on the board and rack', () => {
  test('highlights matching letter tiles on the board and rack', async ({ page }) => {
    await Lib.visitIndex(page);
    await Lib.typeBoard(page, 'cat', 'horizontal', { x: 7, y: 7 });
    await Lib.typeRack(page, 'aab ');
    await openRemainingTilesModal(page);

    await hoverRemainingTile(page, 'a');
    await Lib.expectTileHighlighted(Lib.getRackTile(page, 0));
    await Lib.expectTileHighlighted(Lib.getRackTile(page, 1));
    await Lib.expectTileNotHighlighted(Lib.getRackTile(page, 2));
    await Lib.expectTileNotHighlighted(Lib.getRackTile(page, 3));
    await Lib.expectTileNotHighlighted(Lib.getBoardTile(page, 7, 7));
    await Lib.expectTileHighlighted(Lib.getBoardTile(page, 8, 7));
    await Lib.expectTileNotHighlighted(Lib.getBoardTile(page, 9, 7));

    await hoverRemainingTile(page, 'b');
    await Lib.expectTileNotHighlighted(Lib.getRackTile(page, 0));
    await Lib.expectTileNotHighlighted(Lib.getRackTile(page, 1));
    await Lib.expectTileHighlighted(Lib.getRackTile(page, 2));
    await Lib.expectTileNotHighlighted(Lib.getRackTile(page, 3));
    await Lib.expectTileNotHighlighted(Lib.getBoardTile(page, 7, 7));
    await Lib.expectTileNotHighlighted(Lib.getBoardTile(page, 8, 7));
    await Lib.expectTileNotHighlighted(Lib.getBoardTile(page, 9, 7));
  });

  test('highlights matching blank tiles on the board and rack', async ({ page }) => {
    await Lib.visitIndex(page);
    await Lib.typeBoard(page, 'a', 'horizontal', { x: 7, y: 7 });
    await Lib.getBoardTile(page, 7, 7).focus();
    await Lib.typeBoard(page, ' ', 'horizontal', { x: 7, y: 7 });
    await Lib.typeRack(page, ' a');
    await openRemainingTilesModal(page);

    await hoverRemainingTile(page, ' ');
    await Lib.expectTileHighlighted(Lib.getRackTile(page, 0));
    await Lib.expectTileNotHighlighted(Lib.getRackTile(page, 1));
    await Lib.expectTileHighlighted(Lib.getBoardTile(page, 7, 7));

    await hoverRemainingTile(page, 'a');
    await Lib.expectTileNotHighlighted(Lib.getRackTile(page, 0));
    await Lib.expectTileHighlighted(Lib.getRackTile(page, 1));
    await Lib.expectTileNotHighlighted(Lib.getBoardTile(page, 7, 7));
  });

  test('does not highlight a remaining tile in the sidebar if it has not been used', async ({ page }) => {
    await Lib.visitIndex(page);
    await Lib.typeRack(page, 'a');
    await openRemainingTilesModal(page);

    await hoverRemainingTile(page, 'z');
    await expect(page.getByTestId('remaining-tile-z').locator('[role="mark"]')).toHaveCount(0);
    await Lib.expectTileNotHighlighted(Lib.getRackTile(page, 0));

    await hoverRemainingTile(page, 'a');
    await expect(page.getByTestId('remaining-tile-a').locator('[role="mark"]')).not.toHaveCount(0);
    await Lib.expectTileHighlighted(Lib.getRackTile(page, 0));
  });

  test.describe('full-viewport modal', () => {
    test.use({ viewport: { width: 420, height: 900 } });

    test('does not highlight anything when the modal covers the viewport', async ({ page }) => {
      await Lib.visitIndex(page);
      await Lib.typeBoard(page, 'cat', 'horizontal', { x: 7, y: 7 });
      await Lib.typeRack(page, 'aab ');
      await openRemainingTilesModalFromMenu(page);

      await hoverRemainingTile(page, 'a');
      await expect(page.getByTestId('remaining-tile-a').locator('[role="mark"]')).toHaveCount(0);
      await Lib.expectTileNotHighlighted(Lib.getRackTile(page, 0));
      await Lib.expectTileNotHighlighted(Lib.getBoardTile(page, 8, 7));
    });
  });
});

async function openRemainingTilesModal(page: Page) {
  await page.getByLabel('Remaining tiles', { exact: true }).click();
  await expect(Lib.getOpenModal(page)).toBeVisible();
}

async function openRemainingTilesModalFromMenu(page: Page) {
  await page.getByRole('button', { name: 'Menu', exact: true }).click();
  await Lib.getOpenModal(page).getByLabel('Remaining tiles', { exact: true }).click();
  await expect(page.getByTestId('remaining-tile-a')).toBeVisible();
}

async function hoverRemainingTile(page: Page, character: string) {
  const testId = character === ' ' ? 'remaining-tile-blank' : `remaining-tile-${character}`;
  await page.getByTestId(testId).hover();
}
