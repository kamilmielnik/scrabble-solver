import { type Locator, type Page, expect, test } from '@playwright/test';

import * as Lib from '../lib';

const LANGUAGE_WITHOUT_K = 'Español';
const RIGHT_TO_LEFT_LANGUAGE = 'فارسی';

/**
 * @see https://github.com/kamilmielnik/scrabble-solver/issues/469
 */
test.describe('#469 - Warning icon border-radius does not match the tile border-radius', () => {
  test('fills the sharp corner of a rack tile', async ({ page }) => {
    await Lib.visitIndex(page);
    await Lib.typeRack(page, 'k');
    await changeLanguage(page, LANGUAGE_WITHOUT_K);

    await expectAlertToFillTileCorner(Lib.getRackTile(page, 0));
  });

  test('follows the rounded corner of the last rack tile', async ({ page }) => {
    await Lib.visitIndex(page);
    await Lib.typeRack(page, 'k', 6);
    await changeLanguage(page, LANGUAGE_WITHOUT_K);

    await expectAlertToFillTileCorner(Lib.getRackTile(page, 6));
  });

  test('fills the sharp corner of a board tile', async ({ page }) => {
    await Lib.visitIndex(page);
    await Lib.typeBoard(page, 'kk', 'horizontal', { x: 7, y: 7 });
    await changeLanguage(page, LANGUAGE_WITHOUT_K);

    await expectAlertToFillTileCorner(Lib.getBoardTile(page, 7, 7));
  });

  test('fills the sharp corner of a tile in a right-to-left language', async ({ page }) => {
    await Lib.visitIndex(page);
    await Lib.typeRack(page, 'k');
    await Lib.typeBoard(page, 'kk', 'horizontal', { x: 7, y: 7 });
    await changeLanguage(page, RIGHT_TO_LEFT_LANGUAGE);

    await expect(page.locator('html')).toHaveAttribute('dir', 'rtl');
    await expectAlertToFillTileCorner(Lib.getRackTile(page, 0));
    await expectAlertToFillTileCorner(Lib.getBoardTile(page, 7, 7));
  });
});

async function changeLanguage(page: Page, language: string) {
  await Lib.openSettingsModal(page);
  await Lib.getSettingOption(page, 'Language', language).check();
  await Lib.closeModal(page);
}

async function expectAlertToFillTileCorner(input: Locator) {
  const alert = input.locator('..').locator('svg');

  await expect(alert).toBeVisible();

  const styles = await alert.evaluate((element) => {
    const alertStyle = getComputedStyle(element);
    const tileStyle = getComputedStyle(element.parentElement as Element);

    return {
      alertBackground: alertStyle.backgroundColor,
      alertRadius: alertStyle.borderStartEndRadius,
      tileRadius: tileStyle.borderStartEndRadius,
    };
  });

  expect(styles.alertRadius).toBe(styles.tileRadius);
  expect(styles.alertBackground).not.toBe('rgba(0, 0, 0, 0)');
}
