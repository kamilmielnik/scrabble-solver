export const getModal = () => {
  return cy.findByRole('dialog');
};

export const getOpenModal = () => {
  getModal().parent().should('have.class', 'ReactModal__Overlay--after-open');
  return getModal();
};

export const getBoardContainer = () => {
  return cy.findByTestId('board');
};

export const getBoardTile = (x = 0, y = 0, boardWidth = 15) => {
  const index = y * boardWidth + x;
  return cy.findByTestId('board').findAllByRole('textbox').eq(index);
};

export const getDictionary = () => {
  return cy.findByTestId('dictionary');
};

export const getDictionaryInput = () => {
  return getDictionary().findByRole('textbox');
};

export const getDictionaryTitles = () => {
  return getDictionary().get('h2');
};

export const getLoading = () => {
  return cy.findByTestId('loading');
};

export const getRackContainer = () => {
  return cy.findByTestId('rack');
};

export const getRackTile = (index = 0) => {
  // use hidden: true so that rack can be interacted with while modal is opened
  return getRackContainer().findAllByRole('textbox', { hidden: true }).eq(index);
};

export const getResultsContainer = () => {
  return cy.findByTestId('results');
};

export const getResults = () => {
  return getResultsContainer().findAllByTestId('result');
};

export const getResultsFilterInput = () => {
  return getResultsContainer().findByRole('textbox');
};

export const getResult = (index = 0) => {
  return getResults().eq(index);
};

export const getSettingsButton = () => {
  return cy.findByTestId('settings-button');
};

export const getSettingOption = (section: string, option: string) => {
  return getOpenModal().findByLabelText(section).findByLabelText(option);
};

export const getTooltip = () => {
  return cy.findByRole('tooltip');
};
