import { type Locator, type Page } from '@playwright/test';

export const getModal = (page: Page): Locator => {
  return page.getByRole('dialog');
};

export const getOpenModal = (page: Page): Locator => {
  return page.locator('.ReactModal__Overlay--after-open').getByRole('dialog');
};

export const getBoardContainer = (page: Page): Locator => {
  return page.getByTestId('board');
};

export const getBoardTile = (page: Page, x = 0, y = 0, boardWidth = 15): Locator => {
  const index = y * boardWidth + x;
  return getBoardContainer(page).getByRole('textbox', { includeHidden: true }).nth(index);
};

export const getDictionary = (page: Page): Locator => {
  return page.getByTestId('dictionary');
};

export const getDictionaryInput = (page: Page): Locator => {
  return getDictionary(page).getByRole('textbox');
};

export const getDictionaryTitles = (page: Page): Locator => {
  return getDictionary(page).locator('h2');
};

export const getLoading = (page: Page): Locator => {
  return page.getByTestId('loading');
};

export const getRackContainer = (page: Page): Locator => {
  return page.getByTestId('rack');
};

export const getRackTile = (page: Page, index = 0): Locator => {
  // includeHidden: true so that rack can be interacted with while modal is opened
  return getRackContainer(page).getByRole('textbox', { includeHidden: true }).nth(index);
};

export const getResultsContainer = (page: Page): Locator => {
  return page.getByTestId('results');
};

export const getResults = (page: Page): Locator => {
  return getResultsContainer(page).getByTestId('result');
};

export const getResultsFilterInput = (page: Page): Locator => {
  return getResultsContainer(page).getByRole('textbox');
};

export const getResult = (page: Page, index = 0): Locator => {
  return getResults(page).nth(index);
};

export const getSettingsButton = (page: Page): Locator => {
  return page.getByTestId('settings-button');
};

export const getSettingOption = (page: Page, section: string, option: string): Locator => {
  return getOpenModal(page).getByLabel(section, { exact: true }).getByLabel(option, { exact: true });
};

export const getTooltip = (page: Page): Locator => {
  return page.getByRole('tooltip');
};
