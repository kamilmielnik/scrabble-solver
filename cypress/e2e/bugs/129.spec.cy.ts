import { getModal, getSettingsButton, typeRack, visitIndex } from '../../support';

/*
 * @see https://github.com/kamilmielnik/scrabble-solver/issues/129
 */
it('Esc does not close the sidebar when letters input is focused (#129)', () => {
  visitIndex();

  getSettingsButton().click();
  typeRack('a');
  cy.realPress('Escape');

  getModal().should('not.exist');
});
