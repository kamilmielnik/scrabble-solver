import { type Locator, type Page, expect, test } from '@playwright/test';

import * as Lib from '../lib';

const SIZE_TOLERANCE = 1;

const VIEWPORTS = [
  { width: 320, height: 568 },
  { width: 375, height: 667 },
  { width: 768, height: 1024 },
  { width: 1199, height: 900 },
  { width: 1200, height: 900 },
  { width: 1920, height: 1080 },
];

const GAMES = [
  { columns: 15, game: 'scrabble', locale: 'en-US', rows: 15 },
  { columns: 21, game: 'super-scrabble', locale: 'en-US', rows: 21 },
  { columns: 27, game: 'letter-league', locale: 'en-US', rows: 19 },
];

const ALL_GAMES = [
  ['crossplay', 'en-US'],
  ['kelimelik', 'tr-TR'],
  ['letter-league', 'en-US'],
  ['literaki', 'pl-PL'],
  ['scrabble', 'en-US'],
  ['scrabble-duel', 'en-US'],
  ['super-scrabble', 'en-US'],
  ['wordfeud', 'en-US'],
  ['wyrazy', 'pl-PL'],
];

test.describe('Layout', () => {
  test.beforeEach(async ({ page }) => {
    await Lib.routeDefinitions(page, ['a definition']);
  });

  for (const viewport of VIEWPORTS) {
    test.describe(`${viewport.width}x${viewport.height}`, () => {
      test.use({ viewport });

      for (const { columns, game, locale, rows } of GAMES) {
        test(`fits ${game} on the page, with square cells`, async ({ page }) => {
          await Lib.persistSettings(page, { game, inputMode: 'keyboard', locale });
          await Lib.visitIndex(page);
          await expect(getBoardTiles(page)).toHaveCount(columns * rows);

          const firstCell = await getBox(Lib.getBoardTile(page, 0, 0, columns));
          const lastCell = await getBox(getBoardTiles(page).last());

          expect(await getHorizontalOverflow(page)).toBe(0);
          expect(Math.abs(firstCell.width - firstCell.height)).toBeLessThanOrEqual(SIZE_TOLERANCE);
          expect(lastCell.x + lastCell.width).toBeLessThanOrEqual(viewport.width);
          expect(firstCell.x).toBeGreaterThanOrEqual(0);
        });
      }
    });
  }

  /**
   * Tile inputs are enlarged for tap target audits and overlap their neighbors, so only real hit testing
   * can tell that a tap still lands on the tile under the finger.
   */
  test.describe('tap targets', () => {
    for (const viewport of [
      { width: 420, height: 900 },
      { width: 1440, height: 900 },
    ]) {
      test.describe(`${viewport.width}x${viewport.height}`, () => {
        test.use({ viewport });

        test('sends a tap on any tile or cell to that tile or cell', async ({ page }) => {
          await Lib.visitIndex(page);
          await expect(getBoardTiles(page)).toHaveCount(225);

          expect(await findMisdirectedInputs(page)).toEqual([]);
        });
      });
    }
  });

  test.describe('on a phone', () => {
    test.use({ hasTouch: true, viewport: { width: 420, height: 900 } });

    test('keeps every input at 16px or more, because iOS zooms in on anything smaller', async ({ page }) => {
      await Lib.visitIndex(page);
      await expect(getBoardTiles(page)).toHaveCount(225);

      expect(await findSmallInputs(page)).toEqual([]);

      await Lib.getBoardTile(page, 7, 7).locator('..').tap();
      await page.getByRole('button', { name: 'Enter word', exact: true }).tap();

      await expect(page.getByPlaceholder('Letters', { exact: true })).toBeVisible();
      expect(await findSmallInputs(page)).toEqual([]);
    });
  });

  test.describe('compact split', () => {
    test.describe('one pixel below the breakpoint', () => {
      test.use({ viewport: { width: 1199, height: 900 } });

      test('swaps the sidebar for the compact controls', async ({ page }) => {
        await Lib.visitIndex(page);

        await expect(Lib.getResultsContainer(page)).toBeHidden();
        await expect(Lib.getDictionary(page)).toBeHidden();
        await expect(Lib.getResultCandidatePicker(page)).toBeVisible();
      });

      test('previews the best result, as the compact layout does', async ({ page }) => {
        await Lib.visitIndex(page);
        await Lib.typeBoard(page, 'i', 'horizontal', { x: 7, y: 7 });
        await Lib.typeRack(page, 'q');
        await Lib.getRackTile(page).press('Enter');

        await expect(Lib.getResultCandidatePicker(page)).toContainText('qi');
      });
    });

    test.describe('at the breakpoint', () => {
      test.use({ viewport: { width: 1200, height: 900 } });

      test('shows the sidebar and no compact controls', async ({ page }) => {
        await Lib.visitIndex(page);

        await expect(Lib.getResultsContainer(page)).toBeVisible();
        await expect(Lib.getDictionary(page)).toBeVisible();
        await expect(Lib.getResultCandidatePicker(page)).toBeHidden();
      });
    });

    test.describe('when the window is resized', () => {
      test.use({ viewport: { width: 800, height: 900 } });

      test('closes the results modal, because the sidebar takes over', async ({ page }) => {
        await Lib.preferKeyboardInput(page);
        await Lib.visitIndex(page);
        await Lib.typeBoard(page, 'i', 'horizontal', { x: 7, y: 7 });
        await Lib.typeRack(page, 'q');
        await Lib.solve(page);
        await Lib.openResultsModal(page);

        await page.setViewportSize({ width: 1280, height: 900 });

        await expect(Lib.getModal(page)).toHaveCount(0);
        await expect(Lib.getResults(page)).toHaveCount(2);
      });

      test('keeps the board and the rack across the breakpoint, both ways', async ({ page }) => {
        await Lib.preferKeyboardInput(page);
        await Lib.visitIndex(page);
        await Lib.typeBoard(page, 'cat', 'horizontal', { x: 7, y: 7 });
        await Lib.typeRack(page, 'q');

        await page.setViewportSize({ width: 1280, height: 900 });
        await expect(Lib.getResultsContainer(page)).toBeVisible();
        await page.setViewportSize({ width: 800, height: 900 });

        await expect(Lib.getResultsContainer(page)).toBeHidden();
        await Lib.expectBoardCharacters(page, ['c', 'a', 't']);
        await expect(Lib.getRackTile(page)).toHaveValue('q');
      });
    });
  });

  test.describe('board background', () => {
    for (const [game, locale] of ALL_GAMES) {
      test(`${game} draws an image the browser can decode`, async ({ page }) => {
        await Lib.persistSettings(page, { game, locale });
        await Lib.visitIndex(page);

        const isDecoded = await Lib.getBoardContainer(page).evaluate(async (board) => {
          const [, url] = /url\("(.+)"\)/s.exec(globalThis.getComputedStyle(board).backgroundImage) ?? [];
          const image = new Image();
          image.src = url;
          await image.decode();

          return image.complete;
        });

        expect(isDecoded).toBe(true);
      });
    }
  });

  test.describe('right-to-left', () => {
    test.beforeEach(async ({ page }) => {
      await Lib.persistSettings(page, { game: 'scrabble', inputMode: 'keyboard', locale: 'fa-IR' });
      await Lib.visitIndex(page);
      await expect(page.locator('html')).toHaveAttribute('dir', 'rtl');
    });

    test('lays the board and the rack out from the right', async ({ page }) => {
      const firstCell = await getBox(Lib.getBoardTile(page, 0, 0));
      const secondCell = await getBox(Lib.getBoardTile(page, 1, 0));
      const firstRackTile = await getBox(Lib.getRackTile(page, 0));
      const secondRackTile = await getBox(Lib.getRackTile(page, 1));

      expect(firstCell.x).toBeGreaterThan(secondCell.x);
      expect(firstRackTile.x).toBeGreaterThan(secondRackTile.x);
    });

    test('moves left with the left arrow key, which is forward in reading order', async ({ page }) => {
      await Lib.getBoardTile(page, 3, 3).focus();
      await page.keyboard.press('ArrowLeft');

      await expect(Lib.getBoardTile(page, 4, 3)).toBeFocused();
    });

    test('has no horizontal overflow', async ({ page }) => {
      expect(await getHorizontalOverflow(page)).toBe(0);
    });
  });

  test.describe('modals', () => {
    test.describe('on a short screen', () => {
      test.use({ viewport: { width: 800, height: 400 } });

      test('keeps the close button in view and scrolls to the last setting', async ({ page }) => {
        await Lib.preferKeyboardInput(page);
        await Lib.visitIndex(page);
        await Lib.openSettingsModal(page);

        const lastSetting = Lib.getSettingOption(page, 'Highlight unreachable cells', 'On');
        await expect(Lib.getOpenModal(page).getByLabel('Close', { exact: true })).toBeInViewport();
        await lastSetting.scrollIntoViewIfNeeded();
        await lastSetting.check();

        await expect(lastSetting).toBeChecked();
      });
    });

    test.describe('on a phone', () => {
      test.use({ viewport: { width: 420, height: 900 } });

      test('covers the whole screen', async ({ page }) => {
        await Lib.visitIndex(page);
        await Lib.openMenuModal(page);

        const modal = await getBox(Lib.getOpenModal(page));

        expect(modal.x).toBe(0);
        expect(modal.width).toBe(420);
      });
    });
  });

  test.describe('floating elements', () => {
    test('keeps a tooltip inside the window at the edge of the screen', async ({ page }) => {
      await Lib.visitIndex(page);
      const lastNavButton = page.getByRole('navigation').getByRole('button').last();
      await lastNavButton.hover();

      await expect(Lib.getTooltip(page)).toBeVisible();

      const tooltip = await getBox(Lib.getTooltip(page));

      expect(tooltip.x + tooltip.width).toBeLessThanOrEqual(1440);
      expect(tooltip.x).toBeGreaterThanOrEqual(0);
    });

    for (const [name, viewport] of Object.entries({
      desktop: { width: 1440, height: 900 },
      phone: { width: 420, height: 900 },
    })) {
      test.describe(name, () => {
        test.use({ viewport });

        test('keeps the cell actions inside the window for the last cell of the board', async ({ page }) => {
          await Lib.preferKeyboardInput(page);
          await Lib.visitIndex(page);
          await Lib.getBoardTile(page, 14, 14).focus();

          const actions = await getBox(page.getByTestId('toggle-direction-button'));

          expect(actions.x + actions.width).toBeLessThanOrEqual(viewport.width);
          expect(actions.x).toBeGreaterThanOrEqual(0);
        });
      });
    }
  });
});

function findSmallInputs(page: Page): Promise<(string | null)[]> {
  return page.evaluate(() => {
    return Array.from(document.querySelectorAll('input:not([type="submit"])'))
      .filter((input) => Number.parseFloat(globalThis.getComputedStyle(input).fontSize) < 16)
      .map((input) => input.getAttribute('aria-label') ?? input.getAttribute('placeholder'));
  });
}

function findMisdirectedInputs(page: Page): Promise<(string | null)[]> {
  return page.evaluate(() => {
    const inputs = Array.from(document.querySelectorAll('[data-testid="board"] input, [data-testid="rack"] input'));

    return inputs
      .filter((input) => {
        const face = input.parentElement?.getBoundingClientRect();

        return face && document.elementFromPoint(face.x + face.width / 2, face.y + face.height / 2) !== input;
      })
      .map((input) => input.getAttribute('aria-label'));
  });
}

function getBoardTiles(page: Page): Locator {
  return Lib.getBoardContainer(page).getByRole('textbox', { includeHidden: true });
}

async function getBox(locator: Locator): Promise<{ height: number; width: number; x: number; y: number }> {
  await expect(locator).toBeVisible();

  const box = await locator.boundingBox();

  if (!box) {
    throw new Error('Expected the element to have a box');
  }

  return box;
}

function getHorizontalOverflow(page: Page): Promise<number> {
  return page.evaluate(() => {
    const { clientWidth, scrollWidth } = document.documentElement;

    return Math.max(0, scrollWidth - clientWidth);
  });
}
