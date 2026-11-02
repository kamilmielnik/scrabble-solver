import { type Locator, type Page, expect, test } from '@playwright/test';

import * as Lib from '../lib';

type Rect = NonNullable<Awaited<ReturnType<Locator['boundingBox']>>>;

const ROW_PART_UNDER_EDGE = 10;

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

  test('hands the highlight back to the focused result when the pointer leaves the list', async ({ page }) => {
    await Lib.visitIndex(page);
    await Lib.typeRack(page, 'aet');
    await Lib.solve(page);

    const focused = Lib.getResult(page, 0);
    await focused.focus();
    await expect.poll(() => focused.evaluate((element) => element.matches(':focus-visible'))).toBe(true);
    await Lib.hoverResult(page, 1);
    await expect(Lib.getResult(page, 1)).toHaveAttribute('aria-current', 'true');

    await Lib.moveMouseAway(page);
    await expect(focused).toHaveAttribute('aria-current', 'true');
    await expect(page.locator('[role="mark"]').first()).toBeVisible();
  });

  test('keeps the highlight on the hovered result when focus leaves the list', async ({ page }) => {
    await Lib.visitIndex(page);
    await Lib.typeRack(page, 'aet');
    await Lib.solve(page);

    const focused = Lib.getResult(page, 0);
    const hovered = Lib.getResult(page, 1);
    await focused.focus();
    await Lib.hoverResult(page, 1);
    await expect(hovered).toHaveAttribute('aria-current', 'true');

    await page.keyboard.press('Shift+Tab');
    await expect(focused).not.toBeFocused();
    await expect(hovered).toHaveAttribute('aria-current', 'true');
    await expect(page.locator('[role="mark"]').first()).toBeVisible();
  });

  test('clears the highlight when focus leaves the list, if the keyboard took it from the pointer', async ({
    page,
  }) => {
    await Lib.visitIndex(page);
    await Lib.typeRack(page, 'aet');
    await Lib.solve(page);

    const focused = Lib.getResult(page, 0);
    const hovered = Lib.getResult(page, 1);
    await Lib.hoverResult(page, 1);
    await expect(hovered).toHaveAttribute('aria-current', 'true');
    await focused.focus();
    await expect(focused).toHaveAttribute('aria-current', 'true');

    await page.keyboard.press('Shift+Tab');
    await expect(focused).not.toBeFocused();
    await expect(Lib.getResults(page).and(page.locator('[aria-current]'))).toHaveCount(0);
    await expect(page.locator('[role="mark"]')).toHaveCount(0);
  });

  test('keeps the highlight on the focused result when focus scrolls another result under a pointer that does not move', async ({
    page,
  }) => {
    await Lib.visitIndex(page);
    await Lib.typeRack(page, 'aet');
    await Lib.solve(page);

    const list = Lib.getResultsContainer(page).locator('[role="list"]');
    await Lib.hoverResult(page, 1);
    const pointer = await getCenter(Lib.getResult(page, 1));
    await Lib.getResult(page, 0).focus();

    await tabUntilScrolled(page, list);
    await expect.poll(() => isHoveredRowAt(page, pointer)).toBe(true);
    await waitForRender(page);

    await expect(list.locator(':focus')).toHaveAttribute('aria-current', 'true');
    await expect(Lib.getResults(page).and(page.locator('[aria-current]'))).toHaveCount(1);
  });

  test('draws the focus ring around the focused result, and keeps it there while the list scrolls', async ({
    page,
  }) => {
    await Lib.visitIndex(page);
    await Lib.typeRack(page, 'aet');
    await Lib.solve(page);

    const focused = Lib.getResult(page, 3);
    const ring = page.getByTestId('row-focus-ring');
    await focused.focus();
    await expect(ring).toBeVisible();
    await expectSameBox(ring, focused);
    const boxBeforeScroll = await focused.boundingBox();

    await Lib.getResultsContainer(page)
      .locator('[role="list"]')
      .evaluate((list) => {
        list.scrollTop = 30;
      });
    expect(await focused.boundingBox()).not.toEqual(boxBeforeScroll);
    await expectSameBox(ring, focused);
  });

  test('shows the whole focus ring of the first and the last result', async ({ page }) => {
    await Lib.visitIndex(page);
    await Lib.typeRack(page, 'aet');
    await Lib.solve(page);

    const list = Lib.getResultsContainer(page).locator('[role="list"]');
    const ring = page.getByTestId('row-focus-ring');

    await Lib.getResult(page, 0).focus();
    await expectSameBox(ring, Lib.getResult(page, 0));
    await expectRingInside(ring, list);

    await scrollToEnd(list);
    await expect.poll(() => focusLastRow(list)).toBe(true);
    await expectSameBox(ring, list.locator(':focus'));
    await expectRingInside(ring, list);
  });

  test('keeps the focus ring of a result scrolled under the header or the search input off them', async ({ page }) => {
    await Lib.visitIndex(page);
    await Lib.typeRack(page, 'aet');
    await Lib.solve(page);

    const list = Lib.getResultsContainer(page).locator('[role="list"]');
    const ring = page.getByTestId('row-focus-ring');
    const { aboveList, belowList } = await getRingBands(list);
    const headerEdge = await page.screenshot({ clip: aboveList });
    const searchEdge = await page.screenshot({ clip: belowList });

    await Lib.getResult(page, 0).focus();
    await waitForRing(ring);
    await scrollBy(list, ROW_PART_UNDER_EDGE);
    await expectSameBox(ring, Lib.getResult(page, 0));
    expect((await page.screenshot({ clip: aboveList })).equals(headerEdge)).toBe(true);

    await scrollToEnd(list);
    await expect.poll(() => focusLastRow(list)).toBe(true);
    await waitForRing(ring);
    await scrollBy(list, -ROW_PART_UNDER_EDGE);
    await expectSameBox(ring, list.locator(':focus'));
    expect((await page.screenshot({ clip: belowList })).equals(searchEdge)).toBe(true);
  });
});

function getBackgroundColor(row: Locator): Promise<string> {
  return row.evaluate((element) => globalThis.getComputedStyle(element).backgroundColor);
}

async function getCenter(locator: Locator): Promise<{ x: number; y: number }> {
  const box = await locator.boundingBox();

  if (!box) {
    throw new Error('Expected the element to be visible');
  }

  return { x: box.x + box.width / 2, y: box.y + box.height / 2 };
}

async function tabUntilScrolled(page: Page, list: Locator): Promise<void> {
  const maxTabs = 50;

  for (let tab = 0; tab < maxTabs; ++tab) {
    await page.keyboard.press('Tab');

    if (await list.evaluate((element) => element.scrollTop > 0)) {
      return;
    }
  }

  throw new Error('Expected Tab to scroll the list');
}

/**
 * The browser tells the page that a row scrolled under the pointer only after the scroll ends, and it updates
 * `:hover` at the same time, so this keeps returning false until the page knows which row is under the pointer.
 */
function isHoveredRowAt(page: Page, point: { x: number; y: number }): Promise<boolean> {
  return page.evaluate(({ x, y }) => {
    const row = document.elementFromPoint(x, y)?.closest('[data-testid="result"]');

    return Boolean(row?.matches(':hover') && !row.matches(':focus'));
  }, point);
}

function waitForRender(page: Page): Promise<void> {
  return page.evaluate(async () => {
    await new Promise((resolve) => requestAnimationFrame(resolve));
    await new Promise((resolve) => requestAnimationFrame(resolve));
  });
}

async function expectSameBox(locator: Locator, expected: Locator): Promise<void> {
  await expect.poll(() => locator.boundingBox()).toEqual(await expected.boundingBox());
}

/**
 * react-window renders the rows of a new scroll position a moment after the scroll, so this keeps returning false
 * until the row that ends the list is rendered.
 */
function focusLastRow(list: Locator): Promise<boolean> {
  return list.evaluate((element) => {
    const paddingBottom = Number.parseFloat(globalThis.getComputedStyle(element).paddingBottom);
    const contentBottom =
      element.getBoundingClientRect().top - element.scrollTop + element.scrollHeight - paddingBottom;
    const rows = Array.from(element.querySelectorAll<HTMLElement>('[data-testid="result"]'));
    const lastRow = rows.find((row) => Math.abs(row.getBoundingClientRect().bottom - contentBottom) < 1);

    lastRow?.focus();

    return Boolean(lastRow);
  });
}

/**
 * The strips just above and below the list, as tall as the focus ring and as wide as the list with the ring around it.
 */
async function getRingBands(list: Locator): Promise<Record<'aboveList' | 'belowList', Rect>> {
  const ringSize = await list.evaluate((element) => {
    return Number.parseFloat(globalThis.getComputedStyle(element).getPropertyValue('--focus-effect--size'));
  });
  const listBox = await list.boundingBox();

  if (!listBox || !(ringSize > 0)) {
    throw new Error('Expected the results list to be visible and the focus ring to have a size');
  }

  return {
    aboveList: {
      x: listBox.x - ringSize,
      y: listBox.y - ringSize,
      width: listBox.width + 2 * ringSize,
      height: ringSize,
    },
    belowList: {
      x: listBox.x - ringSize,
      y: listBox.y + listBox.height,
      width: listBox.width + 2 * ringSize,
      height: ringSize,
    },
  };
}

async function expectRingInside(ring: Locator, list: Locator): Promise<void> {
  const { aboveList, belowList } = await getRingBands(list);
  const ringBox = await ring.boundingBox();

  if (!ringBox) {
    throw new Error('Expected the focus ring to be visible');
  }

  // Whole pixels, because a list can be a fraction of a pixel high, while it scrolls by whole pixels.
  expect(Math.round(ringBox.y - aboveList.height)).toBeGreaterThanOrEqual(Math.round(aboveList.y + aboveList.height));
  expect(Math.round(ringBox.y + ringBox.height + belowList.height)).toBeLessThanOrEqual(Math.round(belowList.y));
}

function scrollBy(list: Locator, distance: number): Promise<void> {
  return list.evaluate((element, top) => {
    element.scrollTop += top;
  }, distance);
}

function scrollToEnd(list: Locator): Promise<void> {
  return list.evaluate((element) => {
    element.scrollTop = element.scrollHeight;
  });
}

/**
 * The ring fades in, so a screenshot taken before the fade ends could miss it.
 */
async function waitForRing(ring: Locator): Promise<void> {
  await expect(ring).toBeVisible();
  await ring.evaluate(async (element) => {
    await Promise.all(element.getAnimations().map((animation) => animation.finished));
  });
}
