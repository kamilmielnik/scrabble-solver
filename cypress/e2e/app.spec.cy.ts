import {
  assertResult,
  getBoardTile,
  getDictionary,
  getDictionaryInput,
  getDictionaryTitles,
  getLoading,
  getRackTile,
  getResult,
  getSettingOption,
  getSettingsButton,
  getTooltip,
  solve,
  typeRack,
  visitIndex,
} from '../support';

it('has title', () => {
  visitIndex();

  cy.title().should('equal', 'Scrabble Solver 2 by Kamil Mielnik');
});

it('has default setting values', () => {
  visitIndex();
  getSettingsButton().realClick();

  getSettingOption('Game', 'Scrabble').should('be.checked');
  getSettingOption('Language', 'English (US)').should('be.checked');
  getSettingOption('Coordinates', 'Hidden').should('be.checked');
  getSettingOption('Input mode', 'Keyboard').should('be.checked');
  getSettingOption('Group remaining tiles', 'Do not group').should('be.checked');
});

describe('full app test', () => {
  beforeEach(() => {
    cy.intercept('/api/solve').as('solve');
    cy.intercept('/api/dictionary/**/*').as('dictionary');
  });

  it('Scrabble - Polish', () => {
    visitIndex();
    getSettingsButton().realClick();
    getSettingOption('Language', 'Polski').check();
    getSettingOption('Współrzędne', 'Oryginalne').check();
    cy.realPress('Escape');
    typeRack('abł');
    solve();

    assertResult(0, 'bał', 14);
    getResult(0).realHover();
    getLoading().should('be.visible');
    cy.wait('@dictionary');
    getRackTile(0).parent().should('have.attr', 'role', 'mark');
    getRackTile(1).parent().should('have.attr', 'role', 'mark');
    getRackTile(2).parent().should('have.attr', 'role', 'mark');
    getBoardTile(5, 7).should('have.value', 'b');
    getBoardTile(6, 7).should('have.value', 'a');
    getBoardTile(7, 7).should('have.value', 'ł');
    getBoardTile(5, 7).parent().should('have.attr', 'role', 'mark');
    getBoardTile(6, 7).parent().should('have.attr', 'role', 'mark');
    getBoardTile(7, 7).parent().should('have.attr', 'role', 'mark');
    getDictionaryInput().should('have.value', 'bał');
    getLoading().should('not.exist');
    getDictionaryTitles().should('have.length', 1).and('have.text', 'bał');
    getDictionary()
      .should('include.text', 'bać się')
      .and('include.text', 'odczuwać lęk, strach')
      .and('include.text', 'być niespokojnym o kogoś lub o coś')
      .and('include.text', 'nie śmieć, nie odważać się na coś');

    cy.findByLabelText('Punkty').realClick();
    getTooltip().should('be.visible').and('have.text', 'Punkty');
    assertResult(0, 'ba', 8);
    getResult(0).realHover();
    getRackTile(0).parent().should('have.attr', 'role', 'mark');
    getRackTile(1).parent().should('have.attr', 'role', 'mark');
    getRackTile(2).parent().should('not.have.attr', 'role', 'mark');
    getBoardTile(5, 7).should('not.have.value');
    getBoardTile(6, 7).should('have.value', 'b');
    getBoardTile(7, 7).should('have.value', 'a');
    getBoardTile(5, 7).parent().should('not.have.attr', 'role', 'mark');
    getBoardTile(6, 7).parent().should('have.attr', 'role', 'mark');
    getBoardTile(7, 7).parent().should('have.attr', 'role', 'mark');
    getDictionaryInput().should('have.value', 'ba');
    getLoading().should('be.visible');
    cy.wait('@dictionary');
    getLoading().should('not.exist');
    getDictionaryTitles().should('have.length', 1).and('have.text', 'ba');
    getDictionary()
      .should('include.text', 'wykrzyknik, który wyraża głównie podziw, zdziwienie')
      .and('include.text', 'w wierzeniach staroegipskich: dusza ludzka ginąca wraz z ciałem');

    getResult(0).realClick();
    getRackTile(0).parent().should('not.have.attr', 'role', 'mark');
    getRackTile(1).parent().should('not.have.attr', 'role', 'mark');
    getRackTile(2).parent().should('not.have.attr', 'role', 'mark');
    getRackTile(0).should('not.have.value');
    getRackTile(1).should('not.have.value');
    getRackTile(2).should('have.value', 'ł');
    getBoardTile(6, 7).should('have.value', 'b');
    getBoardTile(7, 7).should('have.value', 'a');

    cy.findByLabelText('Rozwiąż').should('be.visible').and('be.enabled');
  });
});
