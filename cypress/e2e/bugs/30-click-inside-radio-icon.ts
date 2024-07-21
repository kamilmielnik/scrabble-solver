import { getSettingOption, getSettingsButton, unregisterServiceWorkers, visitIndex } from '../../support';

/*
 * @see https://github.com/kamilmielnik/scrabble-solver/issues/30
 */
describe('#30 - Clicking inside an icon of non-first unchecked radio button does not select that option', () => {
  beforeEach(async () => {
    await unregisterServiceWorkers();
  });

  afterEach(() => {
    cy.clearLocalStorage();
  });

  it('Clicking inside an icon of first unchecked radio button selects it', () => {
    visitIndex();
    getSettingsButton().realClick();
    getSettingOption('Language', 'English (GB)').click();
    getSettingOption('Language', 'English (US)') // first unchecked radio button
      .parent('label')
      .findAllByRole('img', { hidden: true })
      .first()
      .realHover({ position: 'center' })
      .realClick({ position: 'center' });
  });
});
