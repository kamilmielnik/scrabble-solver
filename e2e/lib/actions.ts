import { Page } from '@playwright/test';

import { getBoardTile, getRackTile } from './selectors';
import { BoardLocation } from './types';

export const goToIndex = async (page: Page) => {
  await page.goto('http://localhost:3000/');
};

export const typeRack = async (page: Page, tiles: string) => {
  await getRackTile(page, { column: 1 }).focus();

  for (const tile of tiles) {
    await page.keyboard.press(tile);
  }
};

export const typeBoard = async (page: Page, tiles: string, { row, column }: BoardLocation) => {
  await getBoardTile(page, { row, column }).focus();

  for (const tile of tiles) {
    await page.keyboard.press(tile);
  }
};

export const solve = async (page: Page) => {
  await page.keyboard.press('Enter');
};
