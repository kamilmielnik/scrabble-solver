import {
  closeModal,
  getOpenModal,
  getSettingOption,
  getSettingsButton,
  pasteBoard,
  unregisterServiceWorkers,
  visitIndex,
} from '../../support';

/*
 * @see https://github.com/kamilmielnik/scrabble-solver/issues/398
 */
describe('#398 - Solitary digraph tiles are recognised as created words', () => {
  beforeEach(async () => {
    await unregisterServiceWorkers();
  });

  afterEach(() => {
    cy.clearLocalStorage();
  });

  it('should transliterate special characters when pasting in French', () => {
    visitIndex();
    getSettingsButton().realClick();
    getSettingOption('Language', 'Español').check();
    closeModal();
    pasteBoard('chiclean', 'horizontal', 3, 7);
    cy.findByLabelText('Palabras creadas').click();

    getOpenModal().within(() => {
      cy.findByText('ch').should('not.exist');
      cy.findByText('chiclean').should('be.visible');
      cy.findByLabelText('Incorrecto').findByText('0').should('be.visible');
      cy.findByLabelText('Correcto').findByText('1').should('be.visible');
    });
  });
});
