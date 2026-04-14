import {
  closeModal,
  getBoardTile,
  getSettingOption,
  getSettingsButton,
  typeBoard,
  unregisterServiceWorkers,
  visitIndex,
} from '../../support';

/*
 * @see https://github.com/kamilmielnik/scrabble-solver/issues/401
 */
describe('#401 - Board state not preserved on game type change', () => {
  beforeEach(async () => {
    await unregisterServiceWorkers();
  });

  afterEach(() => {
    cy.clearLocalStorage();
  });

  it('preserves tiles centered on the board when switching to a larger game', () => {
    visitIndex();
    typeBoard('word', 'horizontal', 7, 7);

    getSettingsButton().realClick();
    getSettingOption('Game', 'Super Scrabble').check();
    closeModal();

    getBoardTile(10, 10, 21).should('have.value', 'w');
    getBoardTile(11, 10, 21).should('have.value', 'o');
    getBoardTile(12, 10, 21).should('have.value', 'r');
    getBoardTile(13, 10, 21).should('have.value', 'd');
  });
});
