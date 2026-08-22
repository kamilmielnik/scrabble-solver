import { expect, type Page, test } from '@playwright/test';

import * as Lib from '../lib';

test.describe('Results interactions', () => {
  test.describe('compact, non-touch', () => {
    test.use({ hasTouch: false, viewport: { width: 800, height: 900 } });

    test('marks rows as clickable', expectModalRowsToBeClickable);

    test('leaves the candidate untouched while the pointer travels over the list', async ({ page }) => {
      await solveInSidebar(page);
      await Lib.openResultsModal(page);
      await expect(Lib.getModalResult(page, 0)).toHaveAttribute('aria-current', 'true');

      await Lib.hoverModalResult(page, 1);
      await expect(Lib.getModalResult(page, 0)).toHaveAttribute('aria-current', 'true');
      await expect(Lib.getModalResult(page, 1)).not.toHaveAttribute('aria-current');

      await Lib.moveMouseAway(page);
      await expect(Lib.getModalResult(page, 0)).toHaveAttribute('aria-current', 'true');
    });

    test('picks the clicked result and keeps the modal open when it is clicked again', async ({ page }) => {
      await solveInSidebar(page);
      await Lib.openResultsModal(page);

      await Lib.getModalResult(page, 1).click();
      await expect(Lib.getModalResult(page, 1)).toHaveAttribute('aria-current', 'true');
      await expect(Lib.getModalResult(page, 0)).not.toHaveAttribute('aria-current');

      await Lib.getModalResult(page, 1).click();
      await Lib.expectModalToStayOpen(page);
      await expect(Lib.getModalResult(page, 1)).toHaveAttribute('aria-current', 'true');
    });

    test('previews the candidate', expectPreviewToKeepTheCandidate);

    test('inserts the candidate', expectInsertToPlaceTheCandidate);
  });

  test.describe('compact, touch', () => {
    test.use({ hasTouch: true, viewport: { width: 800, height: 900 } });

    test('marks rows as clickable', expectModalRowsToBeClickable);

    test('picks the tapped result and previews it when it is tapped again', async ({ page }) => {
      await solveInSidebar(page);
      await Lib.openResultsModal(page);

      await Lib.getModalResult(page, 1).click();
      await expect(Lib.getModalResult(page, 1)).toHaveAttribute('aria-current', 'true');
      await Lib.expectModalToStayOpen(page);

      await Lib.getModalResult(page, 1).click();
      await expect(Lib.getModal(page)).toHaveCount(0);
      await expect(Lib.getResultCandidatePicker(page)).toContainText('qi');
      await expect(Lib.getRackTile(page)).toHaveValue('q');
    });

    test('previews the candidate', expectPreviewToKeepTheCandidate);

    test('inserts the candidate', expectInsertToPlaceTheCandidate);
  });

  test.describe('desktop, non-touch', () => {
    test.use({ hasTouch: false, viewport: { width: 1440, height: 900 } });

    test('offers no preview or insert button', expectNoResultButtons);

    test('marks rows as clickable', expectSidebarRowsToBeClickable);

    test('previews the hovered result and drops it when the pointer leaves the list', async ({ page }) => {
      await solveInSidebar(page);

      await Lib.hoverResult(page, 0);
      await expect(Lib.getResult(page, 0)).toHaveAttribute('aria-current', 'true');
      await expect(page.locator('[role="mark"]').first()).toBeVisible();

      await Lib.hoverResult(page, 1);
      await expect(Lib.getResult(page, 1)).toHaveAttribute('aria-current', 'true');
      await expect(Lib.getResult(page, 0)).not.toHaveAttribute('aria-current');

      await Lib.moveMouseAway(page);
      await expect(Lib.getResult(page, 1)).not.toHaveAttribute('aria-current');
      await expect(page.locator('[role="mark"]')).toHaveCount(0);
    });

    test('places the clicked result on the board', async ({ page }) => {
      await solveInSidebar(page);

      await Lib.getResult(page, 0).click();
      await Lib.expectBoardCharacters(page, ['q', 'i']);
      await expect(Lib.getRackTile(page)).toHaveValue('');
    });
  });

  test.describe('desktop, touch', () => {
    test.use({ hasTouch: true, viewport: { width: 1440, height: 900 } });

    test('offers no preview or insert button', expectNoResultButtons);

    test('marks rows as clickable', expectSidebarRowsToBeClickable);

    test('picks the tapped result and places it on the board when it is tapped again', async ({ page }) => {
      await solveInSidebar(page);

      await Lib.getResult(page, 0).click();
      await expect(Lib.getResult(page, 0)).toHaveAttribute('aria-current', 'true');
      await expect(Lib.getRackTile(page)).toHaveValue('q');

      await Lib.getResult(page, 0).click();
      await Lib.expectBoardCharacters(page, ['q', 'i']);
      await expect(Lib.getRackTile(page)).toHaveValue('');
    });
  });
});

async function expectModalRowsToBeClickable({ page }: { page: Page }): Promise<void> {
  await solveInSidebar(page);
  await Lib.openResultsModal(page);

  await Lib.expectRowClickable(Lib.getModalResult(page), true);
}

async function expectSidebarRowsToBeClickable({ page }: { page: Page }): Promise<void> {
  await solveInSidebar(page);

  await Lib.expectRowClickable(Lib.getResult(page), true);
}

async function expectPreviewToKeepTheCandidate({ page }: { page: Page }): Promise<void> {
  await solveInSidebar(page);
  await Lib.openResultsModal(page);
  await Lib.getModalResult(page, 1).click();

  await Lib.getOpenModal(page).getByRole('button', { name: 'Preview', exact: true }).click();
  await expect(Lib.getModal(page)).toHaveCount(0);
  await expect(Lib.getResultCandidatePicker(page)).toContainText('qi');
  await expect(Lib.getRackTile(page)).toHaveValue('q');
  await expect(page.locator('[role="mark"]').first()).toBeVisible();
}

async function expectNoResultButtons({ page }: { page: Page }): Promise<void> {
  await solveInSidebar(page);

  await expect(Lib.getResultsContainer(page)).toBeVisible();
  await expect(page.getByRole('button', { name: 'Preview', exact: true })).toHaveCount(0);
  await expect(page.getByRole('button', { name: 'Insert', exact: true })).toHaveCount(0);
}

async function expectInsertToPlaceTheCandidate({ page }: { page: Page }): Promise<void> {
  await solveInSidebar(page);
  await Lib.openResultsModal(page);
  await expect(Lib.getModalResult(page, 0)).toHaveAttribute('aria-current', 'true');

  await Lib.getOpenModal(page).getByRole('button', { name: 'Insert', exact: true }).click();
  await expect(Lib.getModal(page)).toHaveCount(0);
  await Lib.expectBoardCharacters(page, ['q', 'i']);
  await expect(Lib.getRackTile(page)).toHaveValue('');
  await expect(Lib.getResultCandidatePicker(page)).toHaveText('Select...');
}

async function solveInSidebar(page: Page): Promise<void> {
  await Lib.preferKeyboardInput(page);
  await Lib.visitIndex(page);
  await Lib.typeBoard(page, 'i', 'horizontal', { x: 7, y: 7 });
  await Lib.typeRack(page, 'q');
  await Lib.solve(page);
}
