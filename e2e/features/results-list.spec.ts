import { type Locator, expect, test } from '@playwright/test';

import * as Lib from '../lib';

const LONG_RACK = 'aeiorst';

test.describe('Results list in a real layout', () => {
  test.beforeEach(async ({ page }) => {
    await Lib.preferKeyboardInput(page);
    await Lib.routeDefinitions(page, ['a definition']);
  });

  test.describe('desktop', () => {
    test.beforeEach(async ({ page }) => {
      await Lib.visitIndex(page);
      await Lib.typeRack(page, LONG_RACK);
      await Lib.solve(page);
    });

    test('renders only the rows in view', async ({ page }) => {
      const list = getList(page.getByTestId('results'));
      const scrollHeight = await list.evaluate((element) => element.scrollHeight);
      const rowHeight = (await Lib.getResult(page, 0).boundingBox())?.height ?? 0;

      expect(scrollHeight / rowHeight).toBeGreaterThan(await Lib.getResults(page).count());
    });

    test('renders the last rows after scrolling to the end', async ({ page }) => {
      const firstWord = await Lib.getResult(page, 0).getAttribute('aria-label');
      const list = getList(page.getByTestId('results'));
      await list.evaluate((element) => element.scrollTo({ top: element.scrollHeight }));

      await expect(Lib.getResult(page, 0)).not.toHaveAttribute('aria-label', firstWord ?? '');
      await expect(Lib.getResults(page).last()).toBeInViewport();
    });

    test('previews a row reached by scrolling', async ({ page }) => {
      const list = getList(page.getByTestId('results'));
      await list.evaluate((element) => element.scrollTo({ top: element.scrollHeight }));
      const lastRow = Lib.getResults(page).last();
      await expect(lastRow).toBeInViewport();
      await lastRow.hover();

      await expect(lastRow).toHaveAttribute('aria-current', 'true');
      await expect(page.locator('[role="mark"]').first()).toBeVisible();
    });
  });

  test.describe('compact', () => {
    test.use({ viewport: { width: 800, height: 900 } });

    test('opens the modal scrolled to the picked result', async ({ page }) => {
      await Lib.visitIndex(page);
      await Lib.typeRack(page, LONG_RACK);
      await Lib.solve(page);

      for (let step = 0; step < 40; ++step) {
        await page.getByRole('button', { name: 'Next', exact: true }).click();
      }

      await Lib.openResultsModal(page);

      await expect(Lib.getOpenModal(page).locator('[aria-current="true"]')).toBeInViewport({ ratio: 1 });
    });
  });
});

function getList(results: Locator): Locator {
  return results.locator('[role="list"]');
}
