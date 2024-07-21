import {
  assertResult,
  closeModal,
  getResult,
  getResultsFilterInput,
  getSettingOption,
  getSettingsButton,
  solve,
  typeBoard,
  typeRack,
  unregisterServiceWorkers,
  visitIndex,
} from '../../support';

/*
 * @see https://github.com/kamilmielnik/scrabble-solver/issues/342
 */
describe('#342 - Incorrect sorting when filtering', () => {
  beforeEach(async () => {
    await unregisterServiceWorkers();
  });

  it('correctly sorts valid results first when text filter is active', () => {
    visitIndex();
    getSettingsButton().realClick();
    getSettingOption('Language', 'Polski').check();
    closeModal();
    typeBoard('bopie', 'horizontal', 6, 3);
    typeBoard('apu', 'vertical', 8, 4);
    typeBoard('o', 'vertical', 10, 4);
    typeRack('oe');
    solve();
    getResultsFilterInput().type('p');

    assertResult(0, 'po', 5);
    assertResult(1, 'pe', 5);
    assertResult(2, 'op', 3);
    assertResult(3, 'eo', 6);
    getResult(0).should('not.have.attr', 'aria-hidden');
    getResult(1).should('not.have.attr', 'aria-hidden');
    getResult(2).should('not.have.attr', 'aria-hidden');
    getResult(3).should('have.attr', 'aria-hidden', 'true');
  });
});
