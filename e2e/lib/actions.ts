import { expect, type Locator, type Page } from '@playwright/test';

import { getBoardTile, getLoading, getModal, getOpenModal, getRackTile, getResult } from './selectors';

type Direction = 'horizontal' | 'vertical';

interface BoardPosition {
  x?: number;
  y?: number;
}

export const visitIndex = async (page: Page): Promise<void> => {
  await page.goto('/');
};

export const closeModal = async (page: Page): Promise<void> => {
  await expect(getOpenModal(page)).toBeVisible();
  await page.keyboard.press('Escape');
  await expect(getModal(page)).toHaveCount(0);
};

export const typeRack = async (page: Page, tiles: string, index = 0): Promise<void> => {
  await getRackTile(page, index).focus();
  await page.keyboard.type(tiles);
};

export const typeBoard = async (
  page: Page,
  tiles: string,
  direction: Direction,
  { x = 0, y = 0 }: BoardPosition = {},
): Promise<void> => {
  await getBoardTile(page, x, y).focus();
  await ensureDirection(page, direction);

  for (let index = 0; index < tiles.length; ++index) {
    const xOffset = direction === 'horizontal' ? index : 0;
    const yOffset = direction === 'vertical' ? index : 0;

    await getBoardTile(page, x + xOffset, y + yOffset).focus();
    await page.keyboard.type(tiles[index]);
  }
};

export const paste = async (target: Locator, text: string): Promise<void> => {
  await target.focus();
  await target.evaluate((element, value) => {
    const pasteEvent = new ClipboardEvent('paste', {
      bubbles: true,
      clipboardData: new DataTransfer(),
    });

    pasteEvent.clipboardData?.setData('text/plain', value);
    element.dispatchEvent(pasteEvent);
  }, text);
};

export const pasteBoard = async (
  page: Page,
  word: string,
  direction: Direction,
  { x = 0, y = 0 }: BoardPosition = {},
): Promise<void> => {
  await getBoardTile(page, x, y).focus();
  await ensureDirection(page, direction);
  await paste(getBoardTile(page, x, y), word);
};

export const solve = async (page: Page): Promise<void> => {
  const solveResponse = page.waitForResponse('**/api/solve', { timeout: 90_000 });
  await getRackTile(page).evaluate((input: HTMLInputElement) => input.form?.requestSubmit());
  await solveResponse;
  await expect(getLoading(page)).toHaveCount(0);
};

export const assertResult = async (page: Page, index: number, word: string, points: number): Promise<void> => {
  const result = getResult(page, index);

  await expect(result).toHaveAttribute('aria-label', word);
  await expect(result).toContainText(word);
  await expect(result.getByTestId('points')).toHaveText(String(points));
};

export const expectTileHighlighted = async (tile: Locator): Promise<void> => {
  await expect(tile.locator('..')).toHaveAttribute('role', 'mark');
};

export const expectTileNotHighlighted = async (tile: Locator): Promise<void> => {
  await expect(tile.locator('..')).not.toHaveAttribute('role', 'mark');
};

export const moveMouseAway = async (page: Page): Promise<void> => {
  const viewport = page.viewportSize();
  await page.mouse.move((viewport?.width ?? 0) / 2, 0);
};

const ensureDirection = async (page: Page, direction: Direction): Promise<void> => {
  const toggleDirectionButton = page.getByTestId('toggle-direction-button');

  if ((await toggleDirectionButton.getAttribute('data-direction')) !== direction) {
    await toggleDirectionButton.click();
  }
};
