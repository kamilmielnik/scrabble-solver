import {
  assertResult,
  deleteCachedDictionaries,
  getResults,
  solve,
  typeBoard,
  typeRack,
  unregisterServiceWorkers,
  visitIndex,
} from '../../support';

describe('Solver paths', () => {
  beforeEach(async () => {
    await unregisterServiceWorkers();
    await deleteCachedDictionaries();
  });

  afterEach(() => {
    cy.clearLocalStorage();
  });

  it('solves through the server when no dictionary is available locally', () => {
    cy.intercept('GET', '/api/dictionary/*', { statusCode: 503 });
    cy.intercept('POST', '/api/solve').as('solve');
    visitIndex();
    typeBoard('i', 'horizontal', 7, 7);
    typeRack('q');
    solve();
    cy.wait('@solve');

    getResults().should('have.length', 2);
    assertResult(0, 'qi', 11);
  });

  it('solves locally once the dictionary is cached', () => {
    visitIndex();
    waitForCachedDictionary();

    let solveRequestCount = 0;
    cy.intercept('POST', '/api/solve', () => {
      solveRequestCount += 1;
    });
    typeBoard('i', 'horizontal', 7, 7);
    typeRack('q');
    solve();

    getResults().should('have.length', 2);
    assertResult(0, 'qi', 11);
    cy.then(() => {
      expect(solveRequestCount).to.equal(0);
    });
  });
});

const waitForCachedDictionary = () => {
  cy.then({ timeout: 30000 }, async () => {
    const hasDictionary = async () => {
      const cache = await caches.open('dictionary-api-cache');
      return (await cache.match('/api/dictionary/en-US')) !== undefined;
    };

    while (!(await hasDictionary())) {
      await new Promise((resolve) => setTimeout(resolve, 100));
    }
  });
};
