import { test } from '@playwright/test';

import * as Lib from '../lib';

/*
 * @see https://github.com/kamilmielnik/scrabble-solver/issues/427
 */
test.describe('#427 - Highlight created words on board on hover', () => {
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
