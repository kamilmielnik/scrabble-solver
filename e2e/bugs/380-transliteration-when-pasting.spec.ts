import { expect, type Page, test } from '@playwright/test';

import { closeModal, getBoardTile, getSettingOption, getSettingsButton, paste, visitIndex } from '../lib';

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
  await visitIndex(page);
  await getSettingsButton(page).click();
  await getSettingOption(page, 'Language', language).check();
  await closeModal(page);
  await paste(getBoardTile(page, 0, 0), word);

  for (const [x, value] of Array.from(transliterated).entries()) {
    await expect(getBoardTile(page, x, 0)).toHaveValue(value);
  }
}
