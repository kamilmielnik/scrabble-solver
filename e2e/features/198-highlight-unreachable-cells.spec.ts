import { expect, type Page, test } from '@playwright/test';

import {
  closeModal,
  getBoardTile,
  getOpenModal,
  getSettingOption,
  getSettingsButton,
  typeBoard,
  typeRack,
  visitIndex,
} from '../lib';

/*
 * @see https://github.com/kamilmielnik/scrabble-solver/issues/198
 */
test.describe('#198 - Highlight unreachable cells', () => {
  test('has no effect when the rack is empty', async ({ page }) => {
    await visitIndex(page);
    await typeBoard(page, 'cat', 'horizontal', { x: 7, y: 7 });
    await setHighlightUnreachableCells(page, 'On');

    await expectReachable(page, 0, 0);
    await expectReachable(page, 14, 14);
    await expectReachable(page, 7, 7);
    await expectReachable(page, 7, 8);
  });

  test('has no effect when the setting is off', async ({ page }) => {
    await visitIndex(page);
    await typeRack(page, 'abcdefg');

    await expectReachable(page, 0, 0);
    await expectReachable(page, 14, 14);
    await expectReachable(page, 7, 7);
  });

  test('dims unreachable cells on an empty board when rack has tiles', async ({ page }) => {
    await visitIndex(page);
    await typeRack(page, 'abc');
    await setHighlightUnreachableCells(page, 'On');

    await expectReachable(page, 7, 7);
    await expectReachable(page, 5, 7);
    await expectReachable(page, 7, 5);

    await expectUnreachable(page, 0, 0);
    await expectUnreachable(page, 14, 14);
    await expectUnreachable(page, 4, 7);
    await expectUnreachable(page, 6, 6);
  });

  test('dims cells far from any placed tile or rack reach', async ({ page }) => {
    await visitIndex(page);
    await typeBoard(page, 'cat', 'horizontal', { x: 7, y: 7 });
    await typeRack(page, 'ab');
    await setHighlightUnreachableCells(page, 'On');

    await expectReachable(page, 7, 7);
    await expectReachable(page, 6, 7);
    await expectReachable(page, 10, 7);
    await expectReachable(page, 8, 6);

    await expectUnreachable(page, 0, 0);
    await expectUnreachable(page, 14, 14);
    await expectUnreachable(page, 0, 14);
  });

  test('updates dimming when toggled off after being on', async ({ page }) => {
    await visitIndex(page);
    await typeRack(page, 'abc');
    await setHighlightUnreachableCells(page, 'On');
    await expectUnreachable(page, 0, 0);

    await setHighlightUnreachableCells(page, 'Off');
    await expectReachable(page, 0, 0);
    await expectReachable(page, 14, 14);
  });
});

const setHighlightUnreachableCells = async (page: Page, value: 'On' | 'Off') => {
  await getSettingsButton(page).click();
  await expect(getOpenModal(page)).toBeVisible();
  await getSettingOption(page, 'Highlight unreachable cells', value).check();
  await closeModal(page);
};

const expectUnreachable = async (page: Page, x: number, y: number) => {
  await expect(getBoardTile(page, x, y).locator('..')).toHaveClass(/unreachable/);
};

const expectReachable = async (page: Page, x: number, y: number) => {
  await expect(getBoardTile(page, x, y).locator('..')).not.toHaveClass(/unreachable/);
};
