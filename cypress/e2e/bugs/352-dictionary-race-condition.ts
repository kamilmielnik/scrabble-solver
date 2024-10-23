import { getDictionary, getDictionaryInput, unregisterServiceWorkers, visitIndex } from '../../support';

/*
 * @see https://github.com/kamilmielnik/scrabble-solver/issues/352
 */
describe('#352 - Race condition: dictionary result shows up after clearing the board', () => {
  beforeEach(async () => {
    await unregisterServiceWorkers();
  });

  afterEach(() => {
    cy.clearLocalStorage();
  });

  it('Clearing the board prevents pending dictionary results from showing up', () => {
    cy.intercept('GET', '/api/dictionary/en-US/123', { delay: 100 }).as('dictionary');

    visitIndex();

    getDictionaryInput().type('123{Enter}');
    cy.findByLabelText('Clear').click();
    cy.wait('@dictionary');

    getDictionary()
      .should('not.contain.text', 'This word is not allowed')
      .and('not.contain.text', 'Unexpected end of JSON input')
      .and('contain.text', 'Word definition will be shown here.');
  });
});
