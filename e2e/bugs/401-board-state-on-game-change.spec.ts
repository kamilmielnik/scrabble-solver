import { expect, test } from '@playwright/test';

import { closeModal, getBoardTile, getSettingOption, getSettingsButton, typeBoard, visitIndex } from '../lib';

const SUPER_SCRABBLE_BOARD_WIDTH = 21;

/*
 * @see https://github.com/kamilmielnik/scrabble-solver/issues/401
 */
test.describe('#401 - Board state not preserved on game type change', () => {
  test('preserves tiles centered on the board when switching to a larger game', async ({ page }) => {
    await visitIndex(page);
    await typeBoard(page, 'word', 'horizontal', { x: 7, y: 7 });

    await getSettingsButton(page).click();
    await getSettingOption(page, 'Game', 'Super Scrabble').check();
    await closeModal(page);

    await expect(getBoardTile(page, 10, 10, SUPER_SCRABBLE_BOARD_WIDTH)).toHaveValue('w');
    await expect(getBoardTile(page, 11, 10, SUPER_SCRABBLE_BOARD_WIDTH)).toHaveValue('o');
    await expect(getBoardTile(page, 12, 10, SUPER_SCRABBLE_BOARD_WIDTH)).toHaveValue('r');
    await expect(getBoardTile(page, 13, 10, SUPER_SCRABBLE_BOARD_WIDTH)).toHaveValue('d');
  });
});
