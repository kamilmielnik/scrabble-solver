import { type Page, expect, test } from '@playwright/test';

import * as Lib from '../lib';

test.describe('Boot', () => {
  test.describe('without any problem', () => {
    // Blocking service workers makes register() resolve to nothing, which workbox-window trips over.
    test.use({ serviceWorkers: 'allow' });

    test('a first visit logs no error and requests nothing that fails', async ({ page }) => {
      const problems = Lib.trackPageProblems(page);

      await Lib.visitIndexUntilIdle(page);
      await expectHydrated(page);

      expect(problems).toEqual([]);
    });

    for (const [name, settings] of Object.entries({
      'a larger game': { game: 'super-scrabble', locale: 'en-US' },
      'a non-square game': { game: 'letter-league', locale: 'en-US' },
      'a right-to-left language': { game: 'scrabble', locale: 'fa-IR' },
      'another language': { game: 'scrabble', locale: 'pl-PL' },
    })) {
      test(`a returning visit with ${name} hydrates without a mismatch`, async ({ page }) => {
        const problems = Lib.trackPageProblems(page);

        await Lib.persistSettings(page, settings);
        await Lib.visitIndexUntilIdle(page);
        await expectHydrated(page);

        expect(problems).toEqual([]);
      });
    }
  });

  /**
   * Aborting the scripts freezes the page at what the inline script did, which is what a
   * returning user sees before hydration.
   */
  test.describe('before hydration', () => {
    test.beforeEach(async ({ page }) => {
      await page.route('**/_next/static/chunks/**', (route) => route.abort());
    });

    test('hides a board of another game, instead of flashing the prerendered one', async ({ page }) => {
      await Lib.persistSettings(page, { game: 'super-scrabble', locale: 'en-US' });
      await Lib.visitIndex(page);

      await expect(page.locator('main')).toBeHidden();
      await expect(page.getByRole('navigation')).toBeVisible();
      expect(await getRootVariables(page)).toEqual({ cols: '21', rack: '7', rows: '21' });
    });

    test('shows the board right away when the persisted game is the prerendered one', async ({ page }) => {
      await Lib.persistSettings(page, { game: 'scrabble', locale: 'pl-PL' });
      await Lib.visitIndex(page);

      await expect(page.locator('main')).toBeVisible();
      await expect(page.locator('html')).toHaveAttribute('lang', 'pl-PL');
    });

    test('applies a right-to-left direction before first paint', async ({ page }) => {
      await Lib.persistSettings(page, { game: 'scrabble', locale: 'fa-IR' });
      await Lib.visitIndex(page);

      await expect(page.locator('html')).toHaveAttribute('dir', 'rtl');
      await expect(page.locator('html')).toHaveAttribute('lang', 'fa-IR');
    });

    test('keeps the prerendered board for corrupt settings', async ({ page }) => {
      await page.addInitScript(() => {
        localStorage.setItem('scrabble-solver.settings', '{ corrupt');
      });
      await Lib.visitIndex(page);

      await expect(page.locator('main')).toBeVisible();
      await expect(page.locator('html')).toHaveAttribute('dir', 'ltr');
    });

    test('keeps the prerendered board for an unknown game and locale', async ({ page }) => {
      await Lib.persistSettings(page, { game: 'chess', locale: 'xx-XX' });
      await Lib.visitIndex(page);

      await expect(page.locator('main')).toBeVisible();
      await expect(page.locator('html')).toHaveAttribute('lang', 'en-US');
    });
  });

  test('reveals the persisted board after hydration, with every cell in place', async ({ page }) => {
    await Lib.persistSettings(page, { game: 'super-scrabble', locale: 'en-US' });
    await Lib.visitIndex(page);

    await expect(page.locator('html')).not.toHaveClass(/config-pending/);
    await expect(page.locator('main')).toBeVisible();
    await expect(Lib.getBoardContainer(page).getByRole('textbox', { includeHidden: true })).toHaveCount(441);
  });

  test.describe('deferred work', () => {
    test('downloads no dictionary until the first sign of intent', async ({ page }) => {
      const dictionaryRequests = Lib.trackRequests(page, '/api/dictionary/');
      await Lib.visitIndexUntilIdle(page);

      expect(dictionaryRequests).toEqual([]);

      const dictionaryRequest = page.waitForRequest('**/api/dictionary/en-US');
      await page.keyboard.press('Shift');
      await dictionaryRequest;
    });

    test('reports one visit with the landing page, game and language', async ({ page }) => {
      const visits = Lib.trackRequests(page, '/api/visit');
      const visitRequest = page.waitForRequest('**/api/visit');
      await page.goto('/?utm_source=e2e');
      const visit = await visitRequest;
      await page.keyboard.press('Shift');

      const { game, locale, url } = visit.postDataJSON() as Record<string, string>;

      expect(visit.method()).toBe('PUT');
      expect({ game, locale }).toEqual({ game: 'scrabble', locale: 'en-US' });
      expect(url).toContain('utm_source=e2e');
      expect(visits).toHaveLength(1);
    });

    test('keeps working when the visit report fails', async ({ page }) => {
      await page.route('**/api/visit', (route) => route.abort());
      await Lib.visitIndexUntilIdle(page);
      await Lib.typeRack(page, 'a');

      await expect(Lib.getRackTile(page)).toHaveValue('a');
    });
  });

  test.describe('language of the browser', () => {
    for (const [browserLocale, expected] of Object.entries({
      'de-DE': { dir: 'ltr', locale: 'de-DE' },
      'fa-IR': { dir: 'rtl', locale: 'fa-IR' },
      'ja-JP': { dir: 'ltr', locale: 'en-US' },
      'pl-PL': { dir: 'ltr', locale: 'pl-PL' },
    })) {
      test.describe(browserLocale, () => {
        test.use({ locale: browserLocale });

        test(`starts in ${expected.locale} on a first visit`, async ({ page }) => {
          await Lib.visitIndex(page);

          await expect(page.locator('html')).toHaveAttribute('lang', expected.locale);
          await expect(page.locator('html')).toHaveAttribute('dir', expected.dir);
        });
      });
    }

    test.describe('a remembered choice', () => {
      test.use({ locale: 'pl-PL' });

      test('wins over the language of the browser', async ({ page }) => {
        await Lib.persistSettings(page, { game: 'scrabble', locale: 'en-GB' });
        await Lib.visitIndex(page);

        await expect(page.locator('html')).toHaveAttribute('lang', 'en-GB');
      });
    });
  });

  test.describe('input device', () => {
    test.describe('touch', () => {
      test.use({ hasTouch: true, viewport: { width: 420, height: 900 } });

      test('starts in touchscreen mode', async ({ page }) => {
        await Lib.visitIndex(page);
        await Lib.getBoardTile(page, 7, 7).tap();

        await expect(page.getByRole('button', { name: 'Enter word', exact: true })).toBeVisible();
      });

      test('leaves the rack unfocused, although the server-rendered page autofocuses it', async ({ page }) => {
        await Lib.visitIndexUntilIdle(page);

        await expect(Lib.getRackTile(page)).not.toBeFocused();
      });
    });

    test('a pointer device starts with the first rack tile focused', async ({ page }) => {
      await Lib.visitIndex(page);

      await expect(Lib.getRackTile(page)).toBeFocused();
    });
  });
});

async function expectHydrated(page: Page): Promise<void> {
  await expect(page.locator('html')).not.toHaveClass(/config-pending/);
  await expect(
    Lib.getSettingsButton(page)
      .or(page.getByRole('button', { name: 'Menu', exact: true }))
      .first(),
  ).toBeEnabled();
}

function getRootVariables(page: Page): Promise<Record<'cols' | 'rack' | 'rows', string>> {
  return page.evaluate(() => {
    const { style } = document.documentElement;

    return {
      cols: style.getPropertyValue('--board-cols'),
      rack: style.getPropertyValue('--rack-size'),
      rows: style.getPropertyValue('--board-rows'),
    };
  });
}
