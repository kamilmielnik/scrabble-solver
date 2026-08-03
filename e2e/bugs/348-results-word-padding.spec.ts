import { expect, type Page, test } from '@playwright/test';

import { closeModal, getResult, getSettingOption, getSettingsButton, solve, typeRack, visitIndex } from '../lib';

/*
 * @see https://github.com/kamilmielnik/scrabble-solver/issues/348
 */
test.describe('#348 - Missing result word padding when coordinates are not shown', () => {
  test('sets proper padding on result cells depending on coordinates setting (LTR language)', async ({ page }) => {
    await visitIndex(page);
    await typeRack(page, 'ab');
    await solve(page);

    expect(await getWordCellPadding(page, { cellIndex: 0, property: 'paddingLeft' })).toBe('15px');

    await getSettingsButton(page).click();
    await getSettingOption(page, 'Coordinates', 'Original').check();
    await closeModal(page);

    expect(await getWordCellPadding(page, { cellIndex: 1, property: 'paddingLeft' })).toBe('15px');
  });

  test('sets proper padding on result cells depending on coordinates setting (RTL language)', async ({ page }) => {
    await visitIndex(page);
    await getSettingsButton(page).click();
    await getSettingOption(page, 'Language', 'فارسی').check();
    await closeModal(page);
    await typeRack(page, 'فا');
    await solve(page);

    expect(await getWordCellPadding(page, { cellIndex: 0, property: 'paddingRight' })).toBe('15px');

    await getSettingsButton(page).click();
    await getSettingOption(page, 'مختصات', 'إبداعي').check();
    await closeModal(page);

    expect(await getWordCellPadding(page, { cellIndex: 1, property: 'paddingRight' })).toBe('15px');
  });
});

const getWordCellPadding = (
  page: Page,
  { cellIndex, property }: { cellIndex: number; property: 'paddingLeft' | 'paddingRight' },
) => {
  return getResult(page)
    .locator(`:scope > *:nth-child(1) > *:nth-child(${cellIndex + 1})`)
    .evaluate((wordCell, paddingProperty) => window.getComputedStyle(wordCell)[paddingProperty], property);
};
