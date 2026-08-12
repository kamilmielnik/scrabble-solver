import { expect, type Page, test } from '@playwright/test';

import {
  assertResult,
  closeModal,
  expectTileHighlighted,
  expectTileNotHighlighted,
  getBoardTile,
  getDictionary,
  getDictionaryInput,
  getDictionaryTitles,
  getLoading,
  getRackTile,
  getResult,
  getSettingOption,
  getSettingsButton,
  getTooltip,
  hoverResult,
  moveMouseAway,
  solve,
  typeRack,
  visitIndex,
} from './lib';

test.describe('app', () => {
  test('has title', async ({ page }) => {
    await visitIndex(page);

    await expect(page).toHaveTitle('Scrabble Solver 2');
  });

  test('has default setting values', async ({ page }) => {
    await visitIndex(page);
    await getSettingsButton(page).click();

    await expect(getSettingOption(page, 'Game', 'Scrabble')).toBeChecked();
    await expect(getSettingOption(page, 'Language', 'English (US)')).toBeChecked();
    await expect(getSettingOption(page, 'Coordinates', 'Original')).toBeChecked();
    await expect(getSettingOption(page, 'Input mode', 'Keyboard')).toBeChecked();
    await expect(getSettingOption(page, 'Group remaining tiles', 'Do not group')).toBeChecked();
  });

  test.describe('full app test', () => {
    test('Scrabble - Polish', async ({ page }) => {
      await visitIndex(page);
      await getSettingsButton(page).click();
      await getSettingOption(page, 'Language', 'Polski').check();
      await closeModal(page);
      await typeRack(page, 'abł');
      await solve(page);

      await assertResult(page, 0, 'bał', 14);
      const definitionsResponse = waitForDictionaryResponse(page);
      await hoverResult(page, 0);
      await expect(getLoading(page)).toBeVisible();
      await definitionsResponse;
      await expectTileHighlighted(getRackTile(page, 0));
      await expectTileHighlighted(getRackTile(page, 1));
      await expectTileHighlighted(getRackTile(page, 2));
      await expect(getBoardTile(page, 5, 7)).toHaveValue('b');
      await expect(getBoardTile(page, 6, 7)).toHaveValue('a');
      await expect(getBoardTile(page, 7, 7)).toHaveValue('ł');
      await expectTileHighlighted(getBoardTile(page, 5, 7));
      await expectTileHighlighted(getBoardTile(page, 6, 7));
      await expectTileHighlighted(getBoardTile(page, 7, 7));
      await expect(getDictionaryInput(page)).toHaveValue('bał');
      await expect(getLoading(page)).toHaveCount(0);
      await expect(getTooltip(page)).toBeVisible();
      await moveMouseAway(page);
      await expect(getTooltip(page)).toHaveCount(0);
      await expectTileNotHighlighted(getRackTile(page, 0));
      await expect(getDictionaryTitles(page)).toHaveCount(1);
      await expect(getDictionaryTitles(page)).toHaveText('bał');
      await expect(getDictionary(page)).toContainText('bać się');
      await expect(getDictionary(page)).toContainText('odczuwać lęk, strach');
      await expect(getDictionary(page)).toContainText('być niespokojnym o kogoś lub o coś');
      await expect(getDictionary(page)).toContainText('nie śmieć, nie odważać się na coś');

      await page.getByLabel('Punkty', { exact: true }).click();
      await expect(getTooltip(page)).toBeVisible();
      await expect(getTooltip(page)).toHaveText('Punkty');
      await assertResult(page, 0, 'ba', 8);
      const nextDefinitionsResponse = waitForDictionaryResponse(page);
      await hoverResult(page, 0);
      await expectTileHighlighted(getRackTile(page, 0));
      await expectTileHighlighted(getRackTile(page, 1));
      await expectTileNotHighlighted(getRackTile(page, 2));
      await expect(getBoardTile(page, 5, 7)).toHaveValue('');
      await expect(getBoardTile(page, 6, 7)).toHaveValue('b');
      await expect(getBoardTile(page, 7, 7)).toHaveValue('a');
      await expectTileNotHighlighted(getBoardTile(page, 5, 7));
      await expectTileHighlighted(getBoardTile(page, 6, 7));
      await expectTileHighlighted(getBoardTile(page, 7, 7));
      await expect(getDictionaryInput(page)).toHaveValue('ba');
      await expect(getLoading(page)).toBeVisible();
      await nextDefinitionsResponse;
      await expect(getLoading(page)).toHaveCount(0);
      await expect(getDictionaryTitles(page)).toHaveCount(1);
      await expect(getDictionaryTitles(page)).toHaveText('ba');
      await expect(getDictionary(page)).toContainText('wykrzyknik, który wyraża głównie podziw, zdziwienie');
      await expect(getDictionary(page)).toContainText(
        'w wierzeniach staroegipskich: dusza ludzka ginąca wraz z ciałem',
      );

      await getResult(page, 0).click();
      await expectTileNotHighlighted(getRackTile(page, 0));
      await expectTileNotHighlighted(getRackTile(page, 1));
      await expectTileNotHighlighted(getRackTile(page, 2));
      await expect(getRackTile(page, 0)).toHaveValue('');
      await expect(getRackTile(page, 1)).toHaveValue('');
      await expect(getRackTile(page, 2)).toHaveValue('ł');
      await expect(getBoardTile(page, 6, 7)).toHaveValue('b');
      await expect(getBoardTile(page, 7, 7)).toHaveValue('a');

      const solveButton = page.getByLabel('Rozwiąż', { exact: true });
      await expect(solveButton).toBeVisible();
      await expect(solveButton).toBeEnabled();
    });
  });
});

function waitForDictionaryResponse(page: Page) {
  return page.waitForResponse('**/api/dictionary/*/*');
}
