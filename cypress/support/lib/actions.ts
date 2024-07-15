import { getBoardTile, getLoading, getRackTile, getResult } from './selectors';

type KeyOrShortcut = Parameters<typeof cy.realPress>[0];

const getRandomId = () => {
  return String(Math.random()).replace(/^\d\./, '');
};

export const visitIndex = () => {
  cy.visit('/');
};

export const typeRack = (tiles: KeyOrShortcut[], index = 0) => {
  getRackTile(index).focus();

  for (const tile of tiles) {
    cy.realPress(tile);
  }
};

export const typeBoard = (tiles: KeyOrShortcut[], x = 0, y = 0) => {
  getBoardTile(x, y).focus();

  for (const tile of tiles) {
    cy.realPress(tile);
  }
};

export const solve = () => {
  const id = `solve-${getRandomId()}`;

  cy.intercept('/api/solve').as(id);
  getRackTile().focus().parents('form').submit();
  cy.wait(`@${id}`);
  getLoading().should('not.exist');
};

export const assertResult = (index: number, word: string, points: number) => {
  getResult(index).should('have.attr', 'aria-label', word).and('include.text', word);
  getResult(index).findByTestId('points').should('have.text', String(points));
};

export const unregisterServiceWorkers = async () => {
  const registrations = await navigator.serviceWorker.getRegistrations();
  return Promise.all(registrations.map((registration) => registration.unregister()));
};
