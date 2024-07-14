import { getBoardTile, getLoading, getRackTile, getResult } from './selectors';

export const visitIndex = () => {
  cy.visit('http://localhost:3000');
};

export const typeRack = (tiles: string) => {
  getRackTile().focus().type(tiles);
};

export const typeBoard = (tiles: string, x = 0, y = 0) => {
  getBoardTile(x, y).focus().type(tiles);
};

export const solve = () => {
  getRackTile().focus().parents('form').submit();
  getLoading().should('not.exist');
};

export const assertResult = (index: number, word: string, points: number) => {
  getResult(index).should('have.attr', 'aria-label', word).and('include.text', word);
  getResult(index).findByTestId('points').should('have.text', String(points));
};
