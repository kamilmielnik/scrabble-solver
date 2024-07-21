import {
  assertResult,
  getResults,
  solve,
  typeBoard,
  typeRack,
  unregisterServiceWorkers,
  visitIndex,
} from '../../support';

/*
 * @see https://github.com/kamilmielnik/scrabble-solver/issues/2
 */
describe('#2 - "Q" tile does not work', () => {
  beforeEach(async () => {
    await unregisterServiceWorkers();
  });

  afterEach(() => {
    cy.clearLocalStorage();
  });

  it('accepts "Q" tile in English', () => {
    visitIndex();
    typeBoard('i', 'horizontal', 7, 7);
    typeRack('q');
    solve();

    getResults().should('have.length', 2);
    assertResult(0, 'qi', 11);
    assertResult(1, 'qi', 11);
  });
});
