import { type Locator, type Page, expect } from '@playwright/test';
import { type Direction } from '@scrabble-solver/types';

import {
  getBoardContainer,
  getBoardTile,
  getModal,
  getModalResult,
  getOpenModal,
  getRackTile,
  getResult,
  getResultCandidatePicker,
  getResultsContainer,
  getSettingsButton,
} from './selectors';

const MODAL_CLOSE_TRANSITION_TIMEOUT = 500;

interface BoardPosition {
  x?: number;
  y?: number;
}

export async function visitIndex(page: Page): Promise<void> {
  await page.goto('/');
}

/**
 * The visit is reported once the browser is idle, so this also waits out the deferred boot work.
 */
export async function visitIndexUntilIdle(page: Page): Promise<void> {
  const visit = page.waitForRequest('**/api/visit');
  await visitIndex(page);
  await visit;
}

export async function preferKeyboardInput(page: Page): Promise<void> {
  await page.addInitScript(() => {
    localStorage.setItem('scrabble-solver.settings', JSON.stringify({ inputMode: 'keyboard' }));
  });
}

/**
 * Seeds storage once per tab, so that a test can reload and see what the app itself persisted.
 */
export async function persistSettings(page: Page, settings: Record<string, string>): Promise<void> {
  await page.addInitScript((value) => {
    if (sessionStorage.getItem('e2e-seeded') === null) {
      sessionStorage.setItem('e2e-seeded', 'true');
      localStorage.setItem('scrabble-solver.settings', value);
    }
  }, JSON.stringify(settings));
}

export function trackPageProblems(page: Page): string[] {
  const problems: string[] = [];

  page.on('pageerror', (error) => problems.push(`pageerror: ${error.message}`));
  page.on('console', (message) => {
    if (message.type() === 'error') {
      problems.push(`console: ${message.text()}`);
    }
  });
  page.on('response', (response) => {
    if (response.status() >= 400) {
      problems.push(`${response.status()}: ${response.url()}`);
    }
  });

  return problems;
}

export function trackRequests(page: Page, urlPart: string): string[] {
  const urls: string[] = [];

  page.on('request', (request) => {
    if (request.url().includes(urlPart)) {
      urls.push(request.url());
    }
  });

  return urls;
}

export async function routeDefinitions(page: Page, definitions: string[]): Promise<void> {
  await page.route('**/api/dictionary/*/*', async (route) => {
    const word = decodeURIComponent(route.request().url().split('/').at(-1) ?? '');
    await route.fulfill({ json: [{ definitions, exists: true, isAllowed: true, word }] });
  });
}

export async function waitForCachedDictionary(page: Page, locale = 'en-US'): Promise<void> {
  await expect.poll(() => isDictionaryCached(page, locale), { timeout: 60_000 }).toBe(true);
}

export function isDictionaryCached(page: Page, locale = 'en-US'): Promise<boolean> {
  return page.evaluate(async (url) => {
    const cache = await caches.open('dictionary-api-cache');
    return typeof (await cache.match(url)) !== 'undefined';
  }, `/api/dictionary/${locale}`);
}

export async function closeModal(page: Page): Promise<void> {
  await expect(getOpenModal(page)).toBeVisible();
  await page.keyboard.press('Escape');
  await expect(getModal(page)).toHaveCount(0);
}

export async function openWordsModal(page: Page): Promise<void> {
  await openModal(page, page.getByLabel('Created words', { exact: true }));
}

export async function openResultsModal(page: Page): Promise<void> {
  await openModal(page, getResultCandidatePicker(page));
}

export async function openSettingsModal(page: Page): Promise<void> {
  await openModal(page, getSettingsButton(page));
}

export async function openMenuModal(page: Page): Promise<void> {
  await openModal(page, page.getByRole('button', { name: 'Menu', exact: true }));
}

export async function openModal(page: Page, trigger: Locator): Promise<void> {
  const openModalsBeforeClick = await getOpenModal(page).count();
  await trigger.click();
  await expect(getOpenModal(page)).toHaveCount(openModalsBeforeClick + 1);
}

export async function closeModalWithButton(page: Page): Promise<void> {
  await getOpenModal(page).getByLabel('Close', { exact: true }).click();
  await expect(getModal(page)).toHaveCount(0);
}

export async function expectModalToStayOpen(page: Page): Promise<void> {
  await page.waitForTimeout(MODAL_CLOSE_TRANSITION_TIMEOUT);
  await expect(getOpenModal(page)).toBeVisible();
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

export async function solve(page: Page): Promise<void> {
  await getRackTile(page).evaluate((input: HTMLInputElement) => input.form?.requestSubmit());
  await expect(getResultsContainer(page)).toHaveAttribute('data-outdated', 'false', { timeout: 90_000 });
  await expect(getResultsContainer(page).getByTestId('loading')).toHaveCount(0);
}

export async function hoverResult(page: Page, index = 0): Promise<void> {
  await waitForReactWindowToSettle(page);
  await getResult(page, index).hover();
}

export async function hoverModalResult(page: Page, index = 0): Promise<void> {
  await waitForReactWindowToSettle(page);
  await getModalResult(page, index).hover();
}

export async function hoverWord(page: Page, x: number, y: number, direction: Direction): Promise<void> {
  await waitForReactWindowToSettle(page);
  await page.getByTestId(`word-${x}-${y}-${direction}`).hover();
}

async function waitForReactWindowToSettle(page: Page) {
  /**
   * react-window remounts rows during its initial measure pass, and a row
   * replaced under an already-hovered cursor never receives a new mouseenter -
   * let the list settle before hovering.
   */
  await page.waitForTimeout(100);
}

export async function assertResult(page: Page, index: number, word: string, points: number): Promise<void> {
  const result = getResult(page, index);

  await expect(result).toHaveAttribute('aria-label', word);
  await expect(result).toContainText(word);
  await expect(result.getByTestId('points')).toHaveText(String(points));
}

export async function expectBoardCharacters(page: Page, characters: string[]): Promise<void> {
  await expect
    .poll(() =>
      getBoardContainer(page)
        .getByRole('textbox', { includeHidden: true })
        .evaluateAll((inputs) => inputs.map((input) => (input as HTMLInputElement).value).filter(Boolean)),
    )
    .toEqual(characters);
}

export async function expectRowClickable(row: Locator, clickable: boolean): Promise<void> {
  const cursor = await row.evaluate((element) => globalThis.getComputedStyle(element).cursor);

  if (clickable) {
    expect(cursor).toBe('pointer');
  } else {
    expect(cursor).not.toBe('pointer');
  }
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
