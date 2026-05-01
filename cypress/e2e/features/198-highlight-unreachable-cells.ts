import {
  closeModal,
  getBoardTile,
  getOpenModal,
  getSettingOption,
  getSettingsButton,
  typeBoard,
  typeRack,
  unregisterServiceWorkers,
  visitIndex,
} from '../../support';

/*
 * @see https://github.com/kamilmielnik/scrabble-solver/issues/198
 */
describe('#198 - Highlight unreachable cells', () => {
  beforeEach(async () => {
    await unregisterServiceWorkers();
  });

  afterEach(() => {
    cy.clearLocalStorage();
  });

  it('has no effect when the rack is empty', () => {
    visitIndex();
    typeBoard('cat', 'horizontal', 7, 7);
    setHighlightUnreachableCells('On');

    expectReachable(0, 0);
    expectReachable(14, 14);
    expectReachable(7, 7);
    expectReachable(7, 8);
  });

  it('has no effect when the setting is off', () => {
    visitIndex();
    typeRack('abcdefg');

    expectReachable(0, 0);
    expectReachable(14, 14);
    expectReachable(7, 7);
  });

  it('dims unreachable cells on an empty board when rack has tiles', () => {
    visitIndex();
    typeRack('abc');
    setHighlightUnreachableCells('On');

    expectReachable(7, 7);
    expectReachable(5, 7);
    expectReachable(7, 5);

    expectUnreachable(0, 0);
    expectUnreachable(14, 14);
    expectUnreachable(4, 7);
    expectUnreachable(6, 6);
  });

  it('dims cells far from any placed tile or rack reach', () => {
    visitIndex();
    typeBoard('cat', 'horizontal', 7, 7);
    typeRack('ab');
    setHighlightUnreachableCells('On');

    expectReachable(7, 7);
    expectReachable(6, 7);
    expectReachable(10, 7);
    expectReachable(8, 6);

    expectUnreachable(0, 0);
    expectUnreachable(14, 14);
    expectUnreachable(0, 14);
  });

  it('updates dimming when toggled off after being on', () => {
    visitIndex();
    typeRack('abc');
    setHighlightUnreachableCells('On');
    expectUnreachable(0, 0);

    setHighlightUnreachableCells('Off');
    expectReachable(0, 0);
    expectReachable(14, 14);
  });
});

const setHighlightUnreachableCells = (value: 'On' | 'Off') => {
  getSettingsButton().realClick();
  getOpenModal().should('be.visible');
  getSettingOption('Highlight unreachable cells', value).check();
  closeModal();
};

const expectUnreachable = (x: number, y: number) => {
  getBoardTile(x, y).parent().invoke('attr', 'class').should('include', 'unreachable');
};

const expectReachable = (x: number, y: number) => {
  getBoardTile(x, y).parent().invoke('attr', 'class').should('not.include', 'unreachable');
};
