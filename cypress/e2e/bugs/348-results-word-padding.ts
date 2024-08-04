import {
  closeModal,
  getResult,
  getSettingOption,
  getSettingsButton,
  solve,
  typeRack,
  unregisterServiceWorkers,
  visitIndex,
} from '../../support';

/*
 * @see https://github.com/kamilmielnik/scrabble-solver/issues/348
 */
describe('#348 - Missing result word padding when coordinates are not shown', () => {
  beforeEach(async () => {
    await unregisterServiceWorkers();
  });

  afterEach(() => {
    cy.clearLocalStorage();
  });

  it('sets proper padding on result cells depending on coordinates setting (LTR language)', () => {
    visitIndex();
    typeRack('ab');
    solve();

    getResult(0).then(([$result]) => {
      const $span = $result.children[0];
      const wordCell = $span.children[0];

      expect(window.getComputedStyle(wordCell).paddingLeft).to.equal('15px');
    });

    getSettingsButton().realClick();
    getSettingOption('Coordinates', 'Original').check();
    closeModal();

    getResult(0).then(([$result]) => {
      const $span = $result.children[0];
      const wordCell = $span.children[1];

      expect(window.getComputedStyle(wordCell).paddingLeft).to.equal('15px');
    });
  });

  it('sets proper padding on result cells depending on coordinates setting (RTL language)', () => {
    visitIndex();
    getSettingsButton().realClick();
    getSettingOption('Language', 'فارسی').check();
    closeModal();
    typeRack('فا');
    solve();

    getResult(0).then(([$result]) => {
      const $span = $result.children[0];
      const wordCell = $span.children[0];

      expect(window.getComputedStyle(wordCell).paddingRight).to.equal('15px');
    });

    getSettingsButton().realClick();
    getSettingOption('مختصات', 'إبداعي').check();
    closeModal();

    getResult(0).then(([$result]) => {
      const $span = $result.children[0];
      const wordCell = $span.children[1];

      expect(window.getComputedStyle(wordCell).paddingRight).to.equal('15px');
    });
  });
});
