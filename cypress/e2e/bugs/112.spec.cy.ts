import { assertResult, getSettingOption, getSettingsButton, solve, typeRack, visitIndex } from '../../support';

/*
 * @see https://github.com/kamilmielnik/scrabble-solver/issues/112
 */
it('Scrabble - Character bonus not applied (#112)', () => {
  visitIndex();

  getSettingsButton().click();
  getSettingOption('Language', 'Français').check();
  cy.realPress('Escape');
  typeRack('jours');
  solve();

  assertResult(0, 'jours', 40);
  assertResult(1, 'jours', 40);
  assertResult(2, 'jours', 26);
  assertResult(3, 'jours', 26);
  assertResult(4, 'jours', 24);
  assertResult(5, 'jours', 24);
});
