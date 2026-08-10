import { expect, type Page, test } from '@playwright/test';

import * as Lib from '../lib';

/*
 * @see https://github.com/kamilmielnik/scrabble-solver/issues/380
 */
test.describe('#380 - No transliteration when pasting', () => {
  test('should transliterate special characters when pasting in Romanian', async ({ page }) => {
    await testTransliterationOnPaste(page, {
      language: 'Română',
      word: 'abordaserăți',
      transliterated: 'abordaserati',
    });
  });

  test('should transliterate special characters (except "ñ") when pasting in Spanish', async ({ page }) => {
    await testTransliterationOnPaste(page, {
      language: 'Español',
      word: 'bañó',
      transliterated: 'baño',
    });
  });

  test('should transliterate special characters when pasting in French', async ({ page }) => {
    await testTransliterationOnPaste(page, {
      language: 'Français',
      word: 'pâtisserie',
      transliterated: 'patisserie',
    });
  });
});

async function testTransliterationOnPaste(
  page: Page,
  {
    language,
    word,
    transliterated,
  }: {
    language: string;
    word: string;
    transliterated: string;
  },
) {
  await Lib.visitIndex(page);
  await Lib.getSettingsButton(page).click();
  await Lib.getSettingOption(page, 'Language', language).check();
  await Lib.closeModal(page);
  await Lib.paste(Lib.getBoardTile(page, 0, 0), word);

  for (const [x, value] of Array.from(transliterated).entries()) {
    await expect(Lib.getBoardTile(page, x, 0)).toHaveValue(value);
  }
}
