import {
  closeModal,
  getDictionaryInput,
  getResult,
  getSettingOption,
  getSettingsButton,
  solve,
  typeBoard,
  typeRack,
  unregisterServiceWorkers,
  visitIndex,
} from '../../support';

/*
 * @see https://github.com/kamilmielnik/scrabble-solver/issues/363
 */
describe('#363 - Dictionary input should display unique words', () => {
  beforeEach(async () => {
    await unregisterServiceWorkers();
  });

  afterEach(() => {
    cy.clearLocalStorage();
  });

  it('highlighting a word should cause only unique new words to be looked up in the dictionary', () => {
    cy.intercept('GET', '/api/dictionary/tr-TR/*', { delay: 100 }).as('dictionary');

    visitIndex();
    getSettingsButton().realClick();
    getSettingOption('Language', 'Türkçe').check();
    closeModal();
    typeBoard('ponje', 'horizontal', 3, 7);
    typeRack('er');
    solve();

    getResult(0).realHover();

    getDictionaryInput().should('have.value', 'er, je');
  });
});
