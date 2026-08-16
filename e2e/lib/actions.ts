import { expect, type Locator, type Page } from '@playwright/test';
import { type Direction } from '@scrabble-solver/types';

import {
  getBoardTile,
  getLoading,
  getModal,
  getOpenModal,
  getRackTile,
  getResult,
  getResultsContainer,
  getWord,
} from './selectors';

interface BoardPosition {
  x?: number;
  y?: number;
}

export async function visitIndex(page: Page): Promise<void> {
  await page.goto('/');
}

export async function closeModal(page: Page): Promise<void> {
  await expect(getOpenModal(page)).toBeVisible();
  await page.keyboard.press('Escape');
  await expect(getModal(page)).toHaveCount(0);
}

export async function typeRack(page: Page, tiles: string, index = 0): Promise<void> {
  await getRackTile(page, index).focus();
  await page.keyboard.type(tiles);
}

export async function typeBoard(
  page: Page,
  tiles: string,
  direction: Direction,
  { x = 0, y = 0 }: BoardPosition = {},
): Promise<void> {
  await getBoardTile(page, x, y).focus();
  await ensureDirection(page, direction);

  for (let index = 0; index < tiles.length; ++index) {
    const xOffset = direction === 'horizontal' ? index : 0;
    const yOffset = direction === 'vertical' ? index : 0;

    await getBoardTile(page, x + xOffset, y + yOffset).focus();
    await page.keyboard.type(tiles[index]);
  }
}

export async function paste(target: Locator, text: string): Promise<void> {
  await target.focus();
  await target.evaluate((element, value) => {
    const pasteEvent = new ClipboardEvent('paste', {
      bubbles: true,
      clipboardData: new DataTransfer(),
    });

    pasteEvent.clipboardData?.setData('text/plain', value);
    element.dispatchEvent(pasteEvent);
  }, text);
}

export async function pasteBoard(
  page: Page,
  word: string,
  direction: Direction,
  { x = 0, y = 0 }: BoardPosition = {},
): Promise<void> {
  await getBoardTile(page, x, y).focus();
  await ensureDirection(page, direction);
  await paste(getBoardTile(page, x, y), word);
}

export async function solve(page: Page): Promise<void> {
  await getRackTile(page).evaluate((input: HTMLInputElement) => input.form?.requestSubmit());
  await expect(getResultsContainer(page)).toHaveAttribute('data-outdated', 'false', { timeout: 90_000 });
  await expect(getLoading(page)).toHaveCount(0);
}

/**
 * react-window remounts rows during its initial measure pass, and a row
 * replaced under an already-hovered cursor never receives a new mouseenter -
 * let the list settle before hovering.
 */
export async function hoverResult(page: Page, index = 0): Promise<void> {
  await page.waitForTimeout(100);
  await getResult(page, index).hover();
}

/**
 * react-window remounts rows during its initial measure pass, and a row
 * replaced under an already-hovered cursor never receives a new mouseenter -
 * let the list settle before hovering.
 */
export async function hoverWord(page: Page, x: number, y: number, direction: Direction): Promise<void> {
  await page.waitForTimeout(100);
  await page.getByTestId(`word-${x}-${y}-${direction}`).hover();
}

export async function assertWord(page: Page, index: number, word: string): Promise<void> {
  await expect(getWord(page, index)).toHaveAttribute('aria-label', word);
}

export async function assertResult(page: Page, index: number, word: string, points: number): Promise<void> {
  const result = getResult(page, index);

  await expect(result).toHaveAttribute('aria-label', word);
  await expect(result).toContainText(word);
  await expect(result.getByTestId('points')).toHaveText(String(points));
}

export async function expectTileHighlighted(tile: Locator): Promise<void> {
  await expect(tile.locator('..')).toHaveAttribute('role', 'mark');
}

export async function expectTileNotHighlighted(tile: Locator): Promise<void> {
  await expect(tile.locator('..')).not.toHaveAttribute('role', 'mark');
}

export async function moveMouseAway(page: Page): Promise<void> {
  const viewport = page.viewportSize();
  await page.mouse.move((viewport?.width ?? 0) / 2, 0);
}

async function ensureDirection(page: Page, direction: Direction): Promise<void> {
  const toggleDirectionButton = page.getByTestId('toggle-direction-button');

  if ((await toggleDirectionButton.getAttribute('data-direction')) !== direction) {
    await toggleDirectionButton.click();
  }
}
