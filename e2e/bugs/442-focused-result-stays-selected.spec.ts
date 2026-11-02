import { type Locator, expect, test } from '@playwright/test';

import * as Lib from '../lib';

/**
 * @see https://github.com/kamilmielnik/scrabble-solver/issues/442
 */
test.describe('#442 - Keyboard-focused result stays selected after hovering another result', () => {
  test.use({ hasTouch: false, viewport: { width: 1440, height: 900 } });

  test('stops painting the focused result as picked once the pointer picks another one', async ({ page }) => {
    await Lib.visitIndex(page);
    await Lib.typeRack(page, 'aet');
    await Lib.solve(page);

    const focused = Lib.getResult(page, 0);
    const hovered = Lib.getResult(page, 1);
    const untouched = Lib.getResult(page, 2);
    await focused.focus();
    await expect.poll(() => focused.evaluate((element) => element.matches(':focus-visible'))).toBe(true);

    await Lib.hoverResult(page, 1);
    await expect(hovered).toHaveAttribute('aria-current', 'true');
    await expect(focused).not.toHaveAttribute('aria-current');
    await expect(focused).toBeFocused();

    await expect.poll(() => getBackgroundColor(focused)).toBe(await getBackgroundColor(untouched));
    expect(await getBackgroundColor(hovered)).not.toBe(await getBackgroundColor(untouched));
  });

  test('paints the focused result like the hovered one once the pointer leaves the list', async ({ page }) => {
    await Lib.visitIndex(page);
    await Lib.typeRack(page, 'aet');
    await Lib.solve(page);

    const focused = Lib.getResult(page, 0);
    const hovered = Lib.getResult(page, 1);
    await focused.focus();
    await expect.poll(() => focused.evaluate((element) => element.matches(':focus-visible'))).toBe(true);
    await Lib.hoverResult(page, 1);
    await expect(hovered).toHaveAttribute('aria-current', 'true');
    const hoveredBackground = await getBackgroundColor(hovered);

    await Lib.moveMouseAway(page);
    await expect(focused).toHaveAttribute('aria-current', 'true');
    await expect.poll(() => getBackgroundColor(focused)).toBe(hoveredBackground);
    await expect(page.locator('[role="mark"]').first()).toBeVisible();
  });
});

function getBackgroundColor(row: Locator): Promise<string> {
  return row.evaluate((element) => globalThis.getComputedStyle(element).backgroundColor);
}
