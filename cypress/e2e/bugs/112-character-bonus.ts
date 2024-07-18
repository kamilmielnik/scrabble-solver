import {
  assertResult,
  closeModal,
  getSettingOption,
  getSettingsButton,
  solve,
  typeRack,
  visitIndex,
} from '../../support';

/*
 * @see https://github.com/kamilmielnik/scrabble-solver/issues/112
 */
describe('#112 - Scrabble - Character bonus not applied', () => {
  it('correctly shows points for a result which gets a character bonus', () => {
    visitIndex();

    getSettingsButton().realClick();
    getSettingOption('Language', 'Français').check();
    closeModal();
    typeRack('jours');
    solve();

    assertResult(0, 'jours', 40);
    assertResult(1, 'jours', 40);
    assertResult(2, 'jours', 26);
    assertResult(3, 'jours', 26);
    assertResult(4, 'jours', 24);
    assertResult(5, 'jours', 24);
  });
});
