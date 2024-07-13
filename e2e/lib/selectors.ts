import { Page } from '@playwright/test';

import { BoardLocation, RackLocation } from './types';

export const getBoardTile = (page: Page, { row, column }: BoardLocation) => {
  if (row < 0 || column < 0) {
    throw new Error('"row" and "column" need to be positive integers');
  }

  return page.getByLabel(`Board: tile (${column}, ${row})`, { exact: true });
};

export const getRackTile = (page: Page, { column }: RackLocation) => {
  if (column < 0) {
    throw new Error('"column" needs to be a positive integer');
  }

  return page.getByLabel(`Rack: tile (${column})`, { exact: true });
};

export const getSettingsButton = (page: Page) => {
  return page.getByLabel('Settings', { exact: true });
};
