import { expect, type Page, test } from '@playwright/test';

import * as Lib from '../lib';

/*
 * @see https://github.com/kamilmielnik/scrabble-solver/issues/348
 */
test.describe('#348 - Missing result word padding when coordinates are not shown', () => {
  test('sets proper padding on result cells depending on coordinates setting (LTR language)', async ({ page }) => {
    await Lib.visitIndex(page);
    await Lib.typeRack(page, 'ab');
    await Lib.solve(page);

    expect(await getWordCellPadding(page, { cellIndex: 0, property: 'paddingLeft' })).toBe('15px');

    await Lib.getSettingsButton(page).click();
    await Lib.getSettingOption(page, 'Coordinates', 'Original').check();
    await Lib.closeModal(page);

    expect(await getWordCellPadding(page, { cellIndex: 1, property: 'paddingLeft' })).toBe('15px');
  });

  test('sets proper padding on result cells depending on coordinates setting (RTL language)', async ({ page }) => {
    await Lib.visitIndex(page);
    await Lib.getSettingsButton(page).click();
    await Lib.getSettingOption(page, 'Language', 'فارسی').check();
    await Lib.closeModal(page);
    await Lib.typeRack(page, 'فا');
    await Lib.solve(page);

    expect(await getWordCellPadding(page, { cellIndex: 0, property: 'paddingRight' })).toBe('15px');

    await Lib.getSettingsButton(page).click();
    await Lib.getSettingOption(page, 'مختصات', 'إبداعي').check();
    await Lib.closeModal(page);

    expect(await getWordCellPadding(page, { cellIndex: 1, property: 'paddingRight' })).toBe('15px');
  });
});

function getWordCellPadding(
  page: Page,
  { cellIndex, property }: { cellIndex: number; property: 'paddingLeft' | 'paddingRight' },
) {
  return Lib.getResult(page)
    .locator(`:scope > *:nth-child(1) > *:nth-child(${cellIndex + 1})`)
    .evaluate((wordCell, paddingProperty) => window.getComputedStyle(wordCell)[paddingProperty], property);
}
