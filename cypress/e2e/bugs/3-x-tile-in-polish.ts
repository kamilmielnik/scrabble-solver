import {
  closeModal,
  getSettingOption,
  getSettingsButton,
  typeBoard,
  typeRack,
  unregisterServiceWorkers,
  visitIndex,
} from '../../support';

/*
 * @see https://github.com/kamilmielnik/scrabble-solver/issues/3
 */
describe('#3 - "X" tile is allowed in Polish', () => {
  beforeEach(async () => {
    await unregisterServiceWorkers();
  });

  afterEach(() => {
    cy.clearLocalStorage();
  });

  it('does not accept "X" tile in Polish', () => {
    visitIndex();
    getSettingsButton().realClick();
    getSettingOption('Language', 'Polski').check();
    closeModal();
    typeBoard('x', 'horizontal', 7, 7);
    typeRack('x');

    cy.findByText('x').should('not.exist');
  });
});
