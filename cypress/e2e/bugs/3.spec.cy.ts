import { getSettingOption, getSettingsButton, typeBoard, typeRack, visitIndex } from '../../support';

/*
 * @see https://github.com/kamilmielnik/scrabble-solver/issues/3
 */
it('X tile is allowed in Polish language (#3)', () => {
  visitIndex();
  getSettingsButton().realClick();
  getSettingOption('Language', 'Polski').check();
  cy.realPress('Escape');
  typeBoard('x', 7, 7);
  typeRack('x');

  cy.findByText('x').should('not.exist');
});
