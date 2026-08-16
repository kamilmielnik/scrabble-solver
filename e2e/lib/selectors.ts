import { type Locator, type Page } from '@playwright/test';

export function getModal(page: Page): Locator {
  return page.getByRole('dialog');
}

export function getOpenModal(page: Page): Locator {
  return page.locator('.ReactModal__Overlay--after-open').getByRole('dialog');
}

export function getBoardContainer(page: Page): Locator {
  return page.getByTestId('board');
}

export function getBoardTile(page: Page, x = 0, y = 0, boardWidth = 15): Locator {
  const index = y * boardWidth + x;
  return getBoardContainer(page).getByRole('textbox', { includeHidden: true }).nth(index);
}

export function getDictionary(page: Page): Locator {
  return page.getByTestId('dictionary');
}

export function getDictionaryInput(page: Page): Locator {
  return getDictionary(page).getByRole('textbox');
}

export function getDictionaryTitles(page: Page): Locator {
  return getDictionary(page).locator('h2');
}

export function getLoading(page: Page): Locator {
  return page.getByTestId('loading');
}

export function getRackContainer(page: Page): Locator {
  return page.getByTestId('rack');
}

export function getRackTile(page: Page, index = 0): Locator {
  // includeHidden: true so that rack can be interacted with while modal is opened
  return getRackContainer(page).getByRole('textbox', { includeHidden: true }).nth(index);
}

export function getResultsContainer(page: Page): Locator {
  return page.getByTestId('results');
}

export function getResults(page: Page): Locator {
  return getResultsContainer(page).getByTestId('result');
}

export function getResultsFilterInput(page: Page): Locator {
  return getResultsContainer(page).getByRole('textbox');
}

export function getResult(page: Page, index = 0): Locator {
  return getResults(page).nth(index);
}

export function getWordsContainer(page: Page): Locator {
  return page.getByTestId('words');
}

export function getWords(page: Page): Locator {
  return getWordsContainer(page).locator('[data-testid^="word-"]');
}

export function getWord(page: Page, index = 0): Locator {
  return getWords(page).nth(index);
}

export function getSettingsButton(page: Page): Locator {
  return page.getByTestId('settings-button');
}

export function getSettingOption(page: Page, section: string, option: string): Locator {
  return getOpenModal(page).getByLabel(section, { exact: true }).getByLabel(option, { exact: true });
}

export function getTooltip(page: Page): Locator {
  return page.getByRole('tooltip');
}
