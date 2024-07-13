import { Page } from '@playwright/test';

import { BoardLocation, RackLocation } from './types';

export const getBoardTile = (page: Page, { row, column }: BoardLocation) => {
  if (row < 0 || column < 0) {
    throw new Error('"row" and "column" need to be positive integers');
  }

  return page
    .getByTestId('board')
    .getByRole('textbox')
    .count()
    .then((tilesCount) => {
      const boardSize = Math.sqrt(tilesCount);
      const index = (row - 1) * boardSize + (column - 1);
      const tile = page.getByTestId('board').getByRole('textbox').nth(index);
      return tile;
    });
};

export const getRackTile = (page: Page, { column }: RackLocation) => {
  if (column < 0) {
    throw new Error('"column" needs to be a positive integer');
  }

  return page
    .getByTestId('rack')
    .getByRole('textbox')
    .nth(column - 1);
};

export const getSettingsButton = (page: Page) => {
  return page.getByLabel('Settings', { exact: true });
};

export const getSettingOption = (page: Page, { section, option }: { section: string; option: string }) => {
  return page.getByLabel(section, { exact: true }).getByLabel(option, { exact: true });
};
