import { getBoardTile, getLoading, getRackTile, getResult } from './selectors';

const getRandomId = () => {
  return String(10 * Math.random());
};

export const visitIndex = () => {
  if (process.env.NODE_ENV === 'development') {
    cy.visit('http://localhost:3000');
  }

  if (process.env.NODE_ENV === 'production') {
    cy.visit('http://localhost:3333');
  }
};

export const typeRack = (tiles: string) => {
  getRackTile().focus().type(tiles);
};

export const typeBoard = (tiles: string, x = 0, y = 0) => {
  getBoardTile(x, y).focus().type(tiles);
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
