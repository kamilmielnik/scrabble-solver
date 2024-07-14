import { getBoardTile, getRackTile } from './selectors';

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
};
