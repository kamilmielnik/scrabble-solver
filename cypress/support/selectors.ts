export const getModal = () => {
  return cy.findByRole('dialog');
};

export const getBoardContainer = () => {
  return cy.findByTestId('board');
};

export const getBoardTile = (x = 0, y = 0) => {
  return getBoardContainer()
    .findAllByRole('textbox')
    .then((tiles) => {
      const boardSize = Math.sqrt(tiles.length);
      const index = y * boardSize + x;
      return cy.findByTestId('board').findAllByRole('textbox').eq(index);
    });
};

export const getRackContainer = () => {
  return cy.findByTestId('rack');
};

export const getRackTile = (index = 0) => {
  return getRackContainer().findAllByRole('textbox').eq(index);
};

export const getResultsContainer = () => {
  return cy.findByTestId('results');
};

export const getSettingsButton = () => {
  return cy.findByLabelText('Settings');
};

export const getSettingOption = ({ section, option }: { section: string; option: string }) => {
  return cy.get(`[role=dialog] [aria-label="${section}"] [aria-label="${option}"]`);
};
