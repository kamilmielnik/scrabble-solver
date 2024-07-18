import { getModal, getSettingsButton, typeRack, visitIndex } from '../../support';

/*
 * @see https://github.com/kamilmielnik/scrabble-solver/issues/129
 */
describe('#129 - Esc does not close the sidebar when letters input is focused', () => {
  it('Esc key closes the sidebar when rack is focused', () => {
    visitIndex();
    getSettingsButton().realClick();
    typeRack('a');
    cy.realPress('Escape');

    getModal().should('not.exist');
  });
});
