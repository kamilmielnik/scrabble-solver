import {
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
describe('#348', () => {
  beforeEach(async () => {
    await unregisterServiceWorkers();
  });

  it('Missing result word padding when coordinates are not shown (LTR) (#348)', () => {
    visitIndex();
    typeRack('ab');
    solve();

    getResult(0).then(([$result]) => {
      const $span = $result.children[0];
      const firstCell = $span.children[0];
      const lastCell = $span.children[$span.children.length - 1];

      expect(window.getComputedStyle(firstCell).paddingLeft).to.equal('15px');
      expect(window.getComputedStyle(lastCell).paddingRight).to.equal('5px');
    });

    getSettingsButton().realClick();
    getSettingOption('Coordinates', 'Original').check();

    getResult(0).then(([$result]) => {
      const $span = $result.children[0];
      const firstCell = $span.children[0];
      const lastCell = $span.children[$span.children.length - 1];

      expect(window.getComputedStyle(firstCell).paddingLeft).to.equal('5px');
      expect(window.getComputedStyle(lastCell).paddingRight).to.equal('5px');
    });
  });

  it('Missing result word padding when coordinates are not shown (RTL) (#348)', () => {
    visitIndex();
    getSettingsButton().realClick();
    getSettingOption('Language', 'فارسی').check();
    typeRack('فا');
    solve();

    getResult(0).then(([$result]) => {
      const $span = $result.children[0];
      const firstCell = $span.children[0];
      const lastCell = $span.children[$span.children.length - 1];

      expect(window.getComputedStyle(firstCell).paddingRight).to.equal('15px');
      expect(window.getComputedStyle(lastCell).paddingLeft).to.equal('5px');
    });

    getSettingOption('مختصات', 'إبداعي').check();

    getResult(0).then(([$result]) => {
      const $span = $result.children[0];
      const firstCell = $span.children[0];
      const lastCell = $span.children[$span.children.length - 1];

      expect(window.getComputedStyle(firstCell).paddingRight).to.equal('5px');
      expect(window.getComputedStyle(lastCell).paddingLeft).to.equal('5px');
    });
  });
});
