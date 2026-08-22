import { expect, type Locator, type Page, test } from '@playwright/test';

import * as Lib from '../lib';

test.describe('Created words interactions', () => {
  test.describe('compact, non-touch', () => {
    test.use({ hasTouch: false, viewport: { width: 800, height: 900 } });

    test('offers a preview button and no insert button', async ({ page }) => {
      await openWords(page);

      await expect(Lib.getOpenModal(page).getByRole('button', { name: 'Preview', exact: true })).toBeVisible();
      await expect(Lib.getOpenModal(page).getByRole('button', { name: 'Insert', exact: true })).toHaveCount(0);
    });

    test('marks rows as clickable', expectRowsToBeClickable);

    test('leaves the highlight untouched while the pointer travels over the list', async ({ page }) => {
      await openWords(page);
      await expect(Lib.getWord(page, 0)).toHaveAttribute('aria-current', 'true');

      await Lib.hoverWord(page, 3, 5, 'horizontal');
      await expect(Lib.getWord(page, 0)).toHaveAttribute('aria-current', 'true');
      await expect(Lib.getWord(page, 1)).not.toHaveAttribute('aria-current');

      await Lib.moveMouseAway(page);
      await expect(Lib.getWord(page, 0)).toHaveAttribute('aria-current', 'true');
      await Lib.expectTileHighlighted(Lib.getBoardTile(page, 3, 3));
      await Lib.expectTileNotHighlighted(Lib.getBoardTile(page, 3, 5));
    });

    test('picks the clicked word and keeps the modal open when it is clicked again', async ({ page }) => {
      await openWords(page);

      await Lib.getWord(page, 1).click();
      await expect(Lib.getWord(page, 1)).toHaveAttribute('aria-current', 'true');
      await expect(Lib.getWord(page, 0)).not.toHaveAttribute('aria-current');
      await Lib.expectTileHighlighted(Lib.getBoardTile(page, 3, 5));

      await Lib.getWord(page, 1).click();
      await Lib.expectModalToStayOpen(page);
      await expect(Lib.getWord(page, 1)).toHaveAttribute('aria-current', 'true');
      await Lib.expectTileHighlighted(Lib.getBoardTile(page, 3, 5));
    });

    test('keeps the highlight when previewing and drops it when closing', async ({ page }) => {
      await openWords(page);
      await Lib.getWord(page, 1).click();

      await Lib.getOpenModal(page).getByRole('button', { name: 'Preview', exact: true }).click();
      await expect(Lib.getModal(page)).toHaveCount(0);
      await Lib.expectTileHighlighted(Lib.getBoardTile(page, 3, 5));

      await Lib.openWordsModal(page);
      await Lib.closeModalWithButton(page);
      await Lib.expectTileNotHighlighted(Lib.getBoardTile(page, 3, 5));
    });
  });

  test.describe('compact, touch', () => {
    test.use({ hasTouch: true, viewport: { width: 800, height: 900 } });

    test('offers a preview button and no insert button', async ({ page }) => {
      await openWords(page);

      await expect(Lib.getOpenModal(page).getByRole('button', { name: 'Preview', exact: true })).toBeVisible();
      await expect(Lib.getOpenModal(page).getByRole('button', { name: 'Insert', exact: true })).toHaveCount(0);
    });

    test('marks rows as clickable', expectRowsToBeClickable);

    test('picks the tapped word and previews it when it is tapped again', expectRepeatedTapToPreview);

    test('drops the highlight when the modal is closed', expectClosingToDropTheHighlight);
  });

  test.describe('desktop, non-touch', () => {
    test.use({ hasTouch: false, viewport: { width: 1440, height: 900 } });

    test('offers no preview or insert button', expectNoFooterButtons);

    test('does not mark rows as clickable', async ({ page }) => {
      await openWords(page);

      await Lib.expectRowClickable(Lib.getWord(page, 0), false);
    });

    test('hands the highlight over to the hovered row', async ({ page }) => {
      await openWords(page);
      const idleBackground = await getBackgroundColor(Lib.getWord(page, 1));

      await Lib.getWord(page, 1).click();
      await expect(Lib.getWord(page, 1)).toHaveAttribute('aria-current', 'true');
      expect(await getBackgroundColor(Lib.getWord(page, 1))).not.toBe(idleBackground);

      await Lib.hoverWord(page, 3, 3, 'horizontal');
      await expect(Lib.getWord(page, 0)).toHaveAttribute('aria-current', 'true');
      await expect(Lib.getWord(page, 1)).not.toHaveAttribute('aria-current');
      await expect(Lib.getWord(page, 1)).toBeFocused();
      expect(await getBackgroundColor(Lib.getWord(page, 1))).toBe(idleBackground);

      await Lib.expectTileHighlighted(Lib.getBoardTile(page, 3, 3));
      await Lib.expectTileNotHighlighted(Lib.getBoardTile(page, 3, 5));
    });

    test('ignores clicks and drops the highlight when the pointer leaves the list', async ({ page }) => {
      await openWords(page);

      await Lib.getWord(page, 1).click();
      await expect(Lib.getWord(page, 1)).toHaveAttribute('aria-current', 'true');

      await Lib.getWord(page, 1).click();
      await Lib.expectModalToStayOpen(page);

      await Lib.moveMouseAway(page);
      await expect(Lib.getWord(page, 1)).not.toHaveAttribute('aria-current');
      await Lib.expectTileNotHighlighted(Lib.getBoardTile(page, 3, 5));
    });
  });

  test.describe('desktop, touch', () => {
    test.use({ hasTouch: true, viewport: { width: 1440, height: 900 } });

    test('offers no preview or insert button', expectNoFooterButtons);

    test('marks rows as clickable', expectRowsToBeClickable);

    test('picks the tapped word and previews it when it is tapped again', expectRepeatedTapToPreview);

    test('drops the highlight when the modal is closed', expectClosingToDropTheHighlight);
  });
});

async function expectRowsToBeClickable({ page }: { page: Page }): Promise<void> {
  await openWords(page);

  await Lib.expectRowClickable(Lib.getWord(page, 0), true);
}

async function expectRepeatedTapToPreview({ page }: { page: Page }): Promise<void> {
  await openWords(page);

  await Lib.getWord(page, 1).click();
  await expect(Lib.getWord(page, 1)).toHaveAttribute('aria-current', 'true');
  await Lib.expectModalToStayOpen(page);
  await Lib.expectTileHighlighted(Lib.getBoardTile(page, 3, 5));

  await Lib.getWord(page, 1).click();
  await expect(Lib.getModal(page)).toHaveCount(0);
  await Lib.expectTileHighlighted(Lib.getBoardTile(page, 3, 5));
}

async function expectClosingToDropTheHighlight({ page }: { page: Page }): Promise<void> {
  await openWords(page);
  await Lib.getWord(page, 1).click();
  await Lib.expectTileHighlighted(Lib.getBoardTile(page, 3, 5));

  await Lib.closeModalWithButton(page);
  await Lib.expectTileNotHighlighted(Lib.getBoardTile(page, 3, 5));
}

async function expectNoFooterButtons({ page }: { page: Page }): Promise<void> {
  await openWords(page);

  await expect(Lib.getOpenModal(page).getByRole('button', { name: 'Preview', exact: true })).toHaveCount(0);
  await expect(Lib.getOpenModal(page).getByRole('button', { name: 'Insert', exact: true })).toHaveCount(0);
}

async function openWords(page: Page): Promise<void> {
  await Lib.preferKeyboardInput(page);
  await Lib.visitIndex(page);
  await Lib.typeBoard(page, 'cat', 'horizontal', { x: 3, y: 3 });
  await Lib.typeBoard(page, 'dog', 'horizontal', { x: 3, y: 5 });
  await Lib.openWordsModal(page);
}

function getBackgroundColor(row: Locator): Promise<string> {
  return row.evaluate((element) => globalThis.getComputedStyle(element).backgroundColor);
}
