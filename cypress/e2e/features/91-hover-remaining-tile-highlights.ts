import {
  getBoardTile,
  getOpenModal,
  getRackTile,
  typeBoard,
  typeRack,
  unregisterServiceWorkers,
  visitIndex,
} from '../../support';

/*
 * @see https://github.com/kamilmielnik/scrabble-solver/issues/91
 */
describe('#91 - Hovering remaining tile highlights all same tiles on the board and rack', () => {
  beforeEach(async () => {
    await unregisterServiceWorkers();
  });

  afterEach(() => {
    cy.clearLocalStorage();
  });

  it('highlights matching letter tiles on the board and rack', () => {
    visitIndex();
    typeBoard('cat', 'horizontal', 7, 7);
    typeRack('aab ');
    openRemainingTilesModal();

    hoverRemainingTile('a');
    getRackTile(0).parent().should('have.attr', 'role', 'mark');
    getRackTile(1).parent().should('have.attr', 'role', 'mark');
    getRackTile(2).parent().should('not.have.attr', 'role', 'mark');
    getRackTile(3).parent().should('not.have.attr', 'role', 'mark');
    getBoardTile(7, 7).parent().should('not.have.attr', 'role', 'mark');
    getBoardTile(8, 7).parent().should('have.attr', 'role', 'mark');
    getBoardTile(9, 7).parent().should('not.have.attr', 'role', 'mark');

    hoverRemainingTile('b');
    getRackTile(0).parent().should('not.have.attr', 'role', 'mark');
    getRackTile(1).parent().should('not.have.attr', 'role', 'mark');
    getRackTile(2).parent().should('have.attr', 'role', 'mark');
    getRackTile(3).parent().should('not.have.attr', 'role', 'mark');
    getBoardTile(7, 7).parent().should('not.have.attr', 'role', 'mark');
    getBoardTile(8, 7).parent().should('not.have.attr', 'role', 'mark');
    getBoardTile(9, 7).parent().should('not.have.attr', 'role', 'mark');
  });

  it('highlights matching blank tiles on the board and rack', () => {
    visitIndex();
    typeBoard('a', 'horizontal', 7, 7);
    getBoardTile(7, 7).focus();
    typeBoard(' ', 'horizontal', 7, 7);
    typeRack(' a');
    openRemainingTilesModal();

    hoverRemainingTile(' ');
    getRackTile(0).parent().should('have.attr', 'role', 'mark');
    getRackTile(1).parent().should('not.have.attr', 'role', 'mark');
    getBoardTile(7, 7).parent().should('have.attr', 'role', 'mark');

    hoverRemainingTile('a');
    getRackTile(0).parent().should('not.have.attr', 'role', 'mark');
    getRackTile(1).parent().should('have.attr', 'role', 'mark');
    getBoardTile(7, 7).parent().should('not.have.attr', 'role', 'mark');
  });

  it('does not highlight a remaining tile in the sidebar if it has not been used', () => {
    visitIndex();
    typeRack('a');
    openRemainingTilesModal();

    hoverRemainingTile('z');
    cy.findByTestId('remaining-tile-z').find('[role="mark"]').should('not.exist');
    getRackTile(0).parent().should('not.have.attr', 'role', 'mark');

    hoverRemainingTile('a');
    cy.findByTestId('remaining-tile-a').find('[role="mark"]').should('exist');
    getRackTile(0).parent().should('have.attr', 'role', 'mark');
  });
});

const openRemainingTilesModal = () => {
  cy.findByLabelText('Remaining tiles').realClick();
  getOpenModal().should('be.visible');
};

const hoverRemainingTile = (character: string) => {
  const testId = character === ' ' ? 'remaining-tile-blank' : `remaining-tile-${character}`;
  cy.findByTestId(testId).trigger('mouseover');
};
