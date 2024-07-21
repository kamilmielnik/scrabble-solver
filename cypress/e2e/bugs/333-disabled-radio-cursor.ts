import { getSettingOption, getSettingsButton, unregisterServiceWorkers, visitIndex } from '../../support';

/*
 * @see https://github.com/kamilmielnik/scrabble-solver/issues/333
 */
describe('#333 - Disabled radio button has cursor: pointer', () => {
  beforeEach(async () => {
    await unregisterServiceWorkers();
  });

  afterEach(() => {
    cy.clearLocalStorage();
  });

  it('Disabled radio button has cursor: not-allowed', () => {
    visitIndex();
    getSettingsButton().realClick();
    getSettingOption('Language', 'Polski').check();
    getSettingOption('Gra', 'Scrabble').scrollIntoView();
    getSettingOption('Gra', 'Super Scrabble').should('be.disabled');
    getSettingOption('Gra', 'Super Scrabble').should('have.css', 'cursor', 'not-allowed');
  });
});
