import { expect, type Page, test } from '@playwright/test';

import * as Lib from '../lib';

/*
 * @see https://github.com/kamilmielnik/scrabble-solver/issues/430
 */
test.describe('#430 - Highlight unreachable cells includes current results', () => {
  test('narrows the highlight to cells covered by results after solving', async ({ page }) => {
    await Lib.visitIndex(page);
    await Lib.typeBoard(page, 'i', 'horizontal', { x: 7, y: 7 });
    await Lib.typeRack(page, 'q');
    await setHighlightUnreachableCells(page, 'On');

    await expectReachable(page, 6, 7);
    await expectReachable(page, 8, 7);
    await expectReachable(page, 7, 6);
    await expectReachable(page, 7, 8);

    await Lib.solve(page);
    await expect(Lib.getResults(page)).toHaveCount(2);

    await expectReachable(page, 7, 7);
    await expectReachable(page, 6, 7);
    await expectReachable(page, 7, 6);

    await expectUnreachable(page, 8, 7);
    await expectUnreachable(page, 7, 8);
    await expectUnreachable(page, 0, 0);
  });

  test('falls back to the heuristic when results become outdated', async ({ page }) => {
    await Lib.visitIndex(page);
    await Lib.typeBoard(page, 'i', 'horizontal', { x: 7, y: 7 });
    await Lib.typeRack(page, 'q');
    await setHighlightUnreachableCells(page, 'On');
    await Lib.solve(page);
    await expectUnreachable(page, 8, 7);

    await Lib.typeRack(page, 'a', 1);

    await expectReachable(page, 8, 7);
    await expectReachable(page, 7, 8);
    await expectUnreachable(page, 0, 0);
  });

  test('dims all cells when fresh results are empty', async ({ page }) => {
    await Lib.visitIndex(page);
    await Lib.typeRack(page, 'q');
    await setHighlightUnreachableCells(page, 'On');
    await expectReachable(page, 7, 7);

    await Lib.solve(page);
    await expect(Lib.getResults(page)).toHaveCount(0);

    await expectUnreachable(page, 7, 7);
    await expectUnreachable(page, 6, 7);
    await expectUnreachable(page, 0, 0);
  });
});

async function setHighlightUnreachableCells(page: Page, value: 'On' | 'Off') {
  await Lib.getSettingsButton(page).click();
  await expect(Lib.getOpenModal(page)).toBeVisible();
  await Lib.getSettingOption(page, 'Highlight unreachable cells', value).check();
  await Lib.closeModal(page);
}

async function expectUnreachable(page: Page, x: number, y: number) {
  await expect(Lib.getBoardTile(page, x, y).locator('..')).toHaveClass(/unreachable/);
}

async function expectReachable(page: Page, x: number, y: number) {
  await expect(Lib.getBoardTile(page, x, y).locator('..')).not.toHaveClass(/unreachable/);
}
