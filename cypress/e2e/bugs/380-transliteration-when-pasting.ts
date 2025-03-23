import {
  closeModal,
  getBoardTile,
  getSettingOption,
  getSettingsButton,
  unregisterServiceWorkers,
  visitIndex,
} from '../../support';

/*
 * @see https://github.com/kamilmielnik/scrabble-solver/issues/380
 */
describe('#380 - No transliteration when pasting', () => {
  beforeEach(async () => {
    await unregisterServiceWorkers();
  });

  afterEach(() => {
    cy.clearLocalStorage();
  });

  it('should transliterate special characters when pasting in Romanian', () => {
    testTransliterationOnPaste({
      language: 'Română',
      word: 'abordaserăți',
      transliterated: 'abordaserati',
    });
  });

  it('should transliterate special characters (except "ñ") when pasting in Spanish', () => {
    testTransliterationOnPaste({
      language: 'Español',
      word: 'bañó',
      transliterated: 'baño',
    });
  });

  it('should transliterate special characters when pasting in French', () => {
    testTransliterationOnPaste({
      language: 'Français',
      word: 'pâtisserie',
      transliterated: 'patisserie',
    });
  });

  function testTransliterationOnPaste({
    language,
    word,
    transliterated,
  }: {
    language: string;
    word: string;
    transliterated: string;
  }) {
    visitIndex();
    getSettingsButton().realClick();
    getSettingOption('Language', language).check();
    closeModal();
    getBoardTile(0, 0)
      .focus()
      .then(($input) => {
        const pasteEvent = new ClipboardEvent('paste', {
          clipboardData: new DataTransfer(),
          bubbles: true,
        });

        pasteEvent.clipboardData?.setData('text/plain', word);
        $input[0].dispatchEvent(pasteEvent);
      });

    Array.from(transliterated).forEach((value, x) => {
      getBoardTile(x, 0).should('have.value', value);
    });
  }
});
