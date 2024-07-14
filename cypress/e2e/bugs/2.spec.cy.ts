import { getResultsContainer, solve, typeBoard, typeRack, visitIndex } from '../../support';

/*
 * @see https://github.com/kamilmielnik/scrabble-solver/issues/2
 */
it('"Q" tile does not work (#2)', () => {
  visitIndex();
  typeBoard('i', 7, 7);
  typeRack('q');
  solve();

  getResultsContainer().findAllByLabelText('qi').should('have.length', 2);
});
