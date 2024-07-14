import { assertResult, getResults, solve, typeBoard, typeRack, visitIndex } from '../../support';

/*
 * @see https://github.com/kamilmielnik/scrabble-solver/issues/2
 */
it('"Q" tile does not work (#2)', () => {
  visitIndex();
  typeBoard('i', 7, 7);
  typeRack('q');
  solve();

  getResults().should('have.length', 2);
  assertResult(0, 'qi', 11);
  assertResult(1, 'qi', 11);
});
