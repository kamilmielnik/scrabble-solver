import { type Page, expect, test } from '@playwright/test';

import * as Lib from '../lib';

const TAB_PRESSES = 12;

test.describe('Real keyboard and focus', () => {
  test.beforeEach(async ({ page }) => {
    await Lib.preferKeyboardInput(page);
    await Lib.routeDefinitions(page, ['a definition']);
  });

  test.describe('submitting with Enter', () => {
    test('solves from the rack, through the hidden submit input', async ({ page }) => {
      await Lib.visitIndex(page);
      await Lib.typeBoard(page, 'i', 'horizontal', { x: 7, y: 7 });
      await Lib.typeRack(page, 'q');
      await page.keyboard.press('Enter');

      await Lib.assertResult(page, 0, 'qi', 11);
    });

    test('solves from the board', async ({ page }) => {
      await Lib.visitIndex(page);
      await Lib.typeRack(page, 'q');
      await Lib.typeBoard(page, 'i', 'horizontal', { x: 7, y: 7 });
      await Lib.getBoardTile(page, 0, 0).focus();
      await page.keyboard.press('Enter');

      await Lib.assertResult(page, 0, 'qi', 11);
    });

    test('solves a blank from the rack', async ({ page }) => {
      await Lib.visitIndex(page);
      await Lib.typeBoard(page, 'i', 'horizontal', { x: 7, y: 7 });
      await Lib.typeRack(page, ' ');
      await page.keyboard.press('Enter');

      await expect(Lib.getResult(page, 0)).toBeVisible();
      await expect(Lib.getResult(page, 0).getByTestId('points')).toHaveText('1');
    });
  });

  test.describe('tab order', () => {
    test('walks out of the board in one Tab, instead of through every cell', async ({ page }) => {
      await Lib.visitIndex(page);
      await Lib.getBoardTile(page, 0, 0).focus();
      await page.keyboard.press('Tab');

      await expect(Lib.getBoardContainer(page).locator(':focus')).toHaveCount(0);
    });

    test('walks out of the rack in one Tab, too', async ({ page }) => {
      await Lib.visitIndex(page);
      await Lib.getRackTile(page, 0).focus();
      await page.keyboard.press('Tab');

      await expect(Lib.getRackContainer(page).locator(':focus')).toHaveCount(0);
    });

    test('previews a result reached with Tab and applies it with Enter', async ({ page }) => {
      await Lib.visitIndex(page);
      await Lib.typeBoard(page, 'i', 'horizontal', { x: 7, y: 7 });
      await Lib.typeRack(page, 'q');
      await Lib.solve(page);
      await Lib.getResult(page, 0).focus();

      await expect(page.locator('[role="mark"]').first()).toBeVisible();

      await page.keyboard.press('Enter');

      await Lib.expectBoardCharacters(page, ['q', 'i']);
      await expect(Lib.getRackTile(page)).toHaveValue('');
    });
  });

  test.describe('typing into real inputs', () => {
    test('replaces a tile, wherever the caret stands', async ({ page }) => {
      await Lib.visitIndex(page);
      await Lib.typeRack(page, 'ab');

      for (const caretKey of ['Home', 'End']) {
        await Lib.getRackTile(page, 0).focus();
        await page.keyboard.press(caretKey);
        await page.keyboard.type('c');

        await expect(Lib.getRackTile(page, 0)).toHaveValue('c');
        await Lib.getRackTile(page, 0).fill('a');
      }
    });

    test('replaces a board tile, wherever the caret stands', async ({ page }) => {
      await Lib.visitIndex(page);
      await Lib.typeBoard(page, 'a', 'horizontal', { x: 3, y: 3 });
      await Lib.getBoardTile(page, 3, 3).focus();
      await page.keyboard.press('Home');
      await page.keyboard.type('b');

      await expect(Lib.getBoardTile(page, 3, 3)).toHaveValue('b');
      await expect(Lib.getBoardTile(page, 4, 3)).toBeFocused();
    });

    test('lower-cases what Shift or Caps Lock types', async ({ page }) => {
      await Lib.visitIndex(page);
      await Lib.getRackTile(page).focus();
      await page.keyboard.press('Shift+KeyQ');

      await expect(Lib.getRackTile(page, 0)).toHaveValue('q');
      await expect(Lib.getRackTile(page, 1)).toBeFocused();
    });

    test('accepts text that arrives without key events, as from a phone keyboard', async ({ page }) => {
      await Lib.visitIndex(page);
      await Lib.getRackTile(page).focus();
      await page.keyboard.insertText('a');
      await Lib.getBoardTile(page, 3, 3).focus();
      await page.keyboard.insertText('b');

      await expect(Lib.getRackTile(page, 0)).toHaveValue('a');
      await expect(Lib.getBoardTile(page, 3, 3)).toHaveValue('b');
      await expect(Lib.getBoardTile(page, 4, 3)).toBeFocused();
    });

    test('ignores text outside the alphabet without leaving it in the input', async ({ page }) => {
      await Lib.visitIndex(page);
      await Lib.getRackTile(page).focus();
      await page.keyboard.insertText('ж');
      await Lib.getBoardTile(page, 3, 3).focus();
      await page.keyboard.insertText('ж');

      await expect(Lib.getRackTile(page, 0)).toHaveValue('');
      await expect(Lib.getBoardTile(page, 3, 3)).toHaveValue('');
    });

    test('inserts a two-letter tile with Ctrl, instead of the browser shortcut', async ({ page }) => {
      await Lib.persistSettings(page, { game: 'scrabble', inputMode: 'keyboard', locale: 'es-ES' });
      await Lib.visitIndex(page);
      await Lib.getRackTile(page).focus();
      await page.keyboard.press('Control+KeyL');
      await Lib.getBoardTile(page, 3, 3).focus();
      await page.keyboard.press('Control+KeyC');

      await expect(Lib.getRackTile(page, 0)).toHaveValue('ll');
      await expect(Lib.getBoardTile(page, 3, 3)).toHaveValue('ch');
      await expect(page).toHaveURL('/');
    });

    test('toggles a cell filter with Ctrl+G, instead of the find bar', async ({ page }) => {
      await Lib.visitIndex(page);
      await Lib.getBoardTile(page, 3, 3).focus();
      const iconsBefore = await Lib.getBoardContainer(page).locator('svg').count();
      await page.keyboard.press('Control+KeyG');

      await expect(Lib.getBoardContainer(page).locator('svg')).toHaveCount(iconsBefore + 1);
    });

    test('scrolls no page with arrow keys, only moving between cells', async ({ page }) => {
      await page.setViewportSize({ width: 420, height: 500 });
      await Lib.visitIndex(page);
      await Lib.getBoardTile(page, 0, 0).focus();

      const scrollBefore = await page.evaluate(() => window.scrollY);
      await page.keyboard.press('ArrowRight');

      await expect(Lib.getBoardTile(page, 1, 0)).toBeFocused();
      expect(await page.evaluate(() => window.scrollY)).toBe(scrollBefore);
    });
  });

  test.describe('real clipboard', () => {
    test.use({ permissions: ['clipboard-read', 'clipboard-write'] });

    test('pastes a word onto the board along the typing direction', async ({ page }) => {
      await Lib.visitIndex(page);
      await writeClipboard(page, 'CAT');
      await Lib.getBoardTile(page, 3, 3).focus();
      await page.keyboard.press('ControlOrMeta+KeyV');

      await Lib.expectBoardCharacters(page, ['c', 'a', 't']);
      await expect(Lib.getBoardTile(page, 5, 3)).toHaveValue('t');
    });

    test('pastes letters into the rack, dropping what does not fit', async ({ page }) => {
      await Lib.visitIndex(page);
      await writeClipboard(page, 'abcdefghij');
      await Lib.getRackTile(page, 5).focus();
      await page.keyboard.press('ControlOrMeta+KeyV');

      await expect(Lib.getRackTile(page, 5)).toHaveValue('a');
      await expect(Lib.getRackTile(page, 6)).toHaveValue('b');
      await expect(Lib.getRackContainer(page).getByRole('textbox', { includeHidden: true })).toHaveCount(7);
    });

    test('transliterates pasted text for the language', async ({ page }) => {
      await Lib.persistSettings(page, { game: 'scrabble', inputMode: 'keyboard', locale: 'fr-FR' });
      await Lib.visitIndex(page);
      await writeClipboard(page, 'été');
      await Lib.getBoardTile(page, 3, 3).focus();
      await page.keyboard.press('ControlOrMeta+KeyV');

      await Lib.expectBoardCharacters(page, ['e', 't', 'e']);
    });
  });

  test.describe('modals', () => {
    test('moves focus into the modal and never lets Tab reach the app behind it', async ({ page }) => {
      await Lib.visitIndex(page);
      await Lib.openSettingsModal(page);

      for (let press = 0; press < TAB_PRESSES; ++press) {
        await page.keyboard.press('Tab');

        expect(await isFocusInApp(page)).toBe(false);
      }
    });

    test('never lets Shift+Tab reach the app, either', async ({ page }) => {
      await Lib.visitIndex(page);
      await Lib.openSettingsModal(page);

      for (let press = 0; press < TAB_PRESSES; ++press) {
        await page.keyboard.press('Shift+Tab');

        expect(await isFocusInApp(page)).toBe(false);
      }
    });

    test('returns focus to the button that opened it', async ({ page }) => {
      await Lib.visitIndex(page);
      await Lib.openSettingsModal(page);
      await Lib.closeModalWithButton(page);

      await expect(Lib.getSettingsButton(page)).toBeFocused();
    });

    test('leaves the page usable behind the sidebar', async ({ page }) => {
      await Lib.visitIndex(page);
      await Lib.openSettingsModal(page);
      await Lib.getBoardTile(page, 3, 3).click();
      await page.keyboard.type('a');

      await expect(Lib.getBoardTile(page, 3, 3)).toHaveValue('a');
      await Lib.expectModalToStayOpen(page);
    });

    test('closes stacked modals one Escape at a time, top first, returning focus each time', async ({ page }) => {
      await page.setViewportSize({ width: 420, height: 900 });
      await Lib.visitIndex(page);
      await Lib.openMenuModal(page);
      const settingsButton = Lib.getOpenModal(page).getByLabel('Settings', { exact: true });
      await Lib.openModal(page, settingsButton);
      await page.keyboard.press('Escape');

      await expect(Lib.getModal(page).getByRole('heading', { level: 1 })).toHaveText(['Menu']);
      await expect(settingsButton).toBeFocused();

      await page.keyboard.press('Escape');

      await expect(Lib.getModal(page)).toHaveCount(0);
    });

    test('selects a setting with arrow keys, as native radio buttons do', async ({ page }) => {
      await Lib.visitIndex(page);
      await Lib.openSettingsModal(page);
      await Lib.getSettingOption(page, 'Coordinates', 'Original').focus();
      await page.keyboard.press('ArrowDown');

      await expect(Lib.getSettingOption(page, 'Coordinates', 'Original')).not.toBeChecked();
    });
  });

  test.describe('dictionary input', () => {
    for (const [name, text] of Object.entries({
      'an empty search': '',
      'only commas': ', ,',
      'only spaces': '   ',
    })) {
      test(`refuses ${name} through native form validation`, async ({ page }) => {
        const lookups = Lib.trackRequests(page, '/api/dictionary/en-US/');
        await Lib.routeDefinitions(page, ['a definition']);
        await Lib.visitIndex(page);
        await Lib.getDictionaryInput(page).fill(text);
        await Lib.getDictionaryInput(page).press('Enter');

        await expect(Lib.getDictionaryInput(page)).toHaveJSProperty('validity.valid', false);
        await expect(Lib.getDictionary(page)).toContainText('Word definition will be shown here.');
        expect(lookups).toEqual([]);
      });
    }

    test('looks a word up with Enter and stays usable after a server error', async ({ page }) => {
      await page.route('**/api/dictionary/en-US/broken', (route) => {
        return route.fulfill({ body: '<html>Bad Gateway</html>', status: 502 });
      });
      await page.route('**/api/dictionary/en-US/cat', (route) => {
        return route.fulfill({
          json: [{ definitions: ['a small animal'], exists: true, isAllowed: true, word: 'cat' }],
        });
      });
      await Lib.visitIndex(page);

      await Lib.getDictionaryInput(page).fill('broken');
      await Lib.getDictionaryInput(page).press('Enter');
      await expect(Lib.getDictionary(page)).toContainText('HTTP 502');

      await Lib.getDictionaryInput(page).fill('cat');
      await Lib.getDictionaryInput(page).press('Enter');
      await expect(Lib.getDictionary(page)).toContainText('a small animal');
    });

    test('splits a list of words typed with commas', async ({ page }) => {
      await Lib.routeDefinitions(page, ['a definition']);
      await Lib.visitIndex(page);
      await Lib.getDictionaryInput(page).fill('cat, dog');
      await Lib.getDictionaryInput(page).press('Enter');

      await expect(Lib.getDictionaryTitles(page).first()).toBeVisible();
    });
  });
});

function isFocusInApp(page: Page): Promise<boolean> {
  return page.evaluate(() => {
    return document.activeElement?.closest('main, nav') !== null;
  });
}

async function writeClipboard(page: Page, text: string): Promise<void> {
  await page.evaluate((value) => navigator.clipboard.writeText(value), text);
}
