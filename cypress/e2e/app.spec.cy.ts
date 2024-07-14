import { getSettingOption, getSettingsButton, visitIndex } from '../support';

it('has title', () => {
  visitIndex();

  cy.title().should('equal', 'Scrabble Solver 2 by Kamil Mielnik');
});

it('has default setting values', () => {
  visitIndex();
  getSettingsButton().click();

  getSettingOption('Game', 'Scrabble').should('be.checked');
  getSettingOption('Language', 'English (US)').should('be.checked');
  getSettingOption('Coordinates', 'Hidden').should('be.checked');
  getSettingOption('Input mode', 'Keyboard').should('be.checked');
  getSettingOption('Group remaining tiles', 'Do not group').should('be.checked');
});
