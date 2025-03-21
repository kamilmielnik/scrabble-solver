import { getBoardTile, getLoading, getModal, getRackTile, getResult } from './selectors';

const getRandomId = () => {
  return String(Math.random()).replace(/^\d\./, '');
};

export const visitIndex = () => {
  cy.visit('/');
};

export const closeModal = () => {
  getModal().should('be.visible');
  cy.realPress('Escape');
  getModal().should('not.exist');
};

export const typeRack = (tiles: string, index = 0) => {
  getRackTile(index).focus().type(tiles);
};

export const typeBoard = (tiles: string, direction: 'horizontal' | 'vertical', x = 0, y = 0) => {
  getBoardTile(x, y).focus();

  cy.findByTestId('toggle-direction-button').then(([$button]) => {
    if ($button.dataset.direction !== direction) {
      cy.wrap($button).click();
    }
  });

  for (let index = 0; index < tiles.length; ++index) {
    const xOffset = direction === 'horizontal' ? index : 0;
    const yOffset = direction === 'vertical' ? index : 0;

    getBoardTile(x + xOffset, y + yOffset)
      .focus()
      .type(tiles[index]);
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

export const moveMouseAway = () => {
  cy.window().then((window) => {
    cy.get('body').realMouseMove(window.innerWidth / 2, 0);
  });
};
