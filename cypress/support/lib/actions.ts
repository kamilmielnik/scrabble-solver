import {
  getBoardTile,
  getLoading,
  getModal,
  getOpenModal,
  getRackTile,
  getResult,
  getResultsContainer,
} from './selectors';

export const visitIndex = () => {
  cy.visit('/');
};

export const closeModal = () => {
  getOpenModal().should('be.visible');
  cy.realPress('Escape');
  getModal().should('not.exist');
};

export const typeRack = (tiles: string, index = 0) => {
  getRackTile(index).focus().type(tiles);
};

export const typeBoard = (tiles: string, direction: 'horizontal' | 'vertical', x = 0, y = 0) => {
  getBoardTile(x, y).focus();

  cy.findByTestId('toggle-direction-button').then(([$button]) => {
    if ($button.dataset.direction !== direction) {
      cy.wrap($button).click();
    }
  });

  for (let index = 0; index < tiles.length; ++index) {
    const xOffset = direction === 'horizontal' ? index : 0;
    const yOffset = direction === 'vertical' ? index : 0;

    getBoardTile(x + xOffset, y + yOffset)
      .focus()
      .type(tiles[index]);
  }
};

export const pasteBoard = (word: string, direction: 'horizontal' | 'vertical', x = 0, y = 0) => {
  getBoardTile(x, y).focus();

  cy.findByTestId('toggle-direction-button').then(([$button]) => {
    if ($button.dataset.direction !== direction) {
      cy.wrap($button).click();
    }
  });

  getBoardTile(x, y)
    .focus()
    .then(($input) => {
      const pasteEvent = new ClipboardEvent('paste', {
        clipboardData: new DataTransfer(),
        bubbles: true,
      });

      pasteEvent.clipboardData?.setData('text/plain', word);
      $input[0].dispatchEvent(pasteEvent);
    });
};

export const solve = () => {
  getRackTile().focus().parents('form').submit();
  getResultsContainer().should('have.attr', 'data-outdated', 'false');
  getLoading().should('not.exist');
};

/**
 * react-window remounts rows during its initial measure pass, and a row
 * replaced under an already-hovered cursor never receives a new mouseenter -
 * let the list settle before hovering.
 */
export const hoverResult = (index = 0) => {
  cy.wait(100);
  getResult(index).realHover();
};

/**
 * Dropping the dictionary without its revalidation timestamp leaves the app
 * throttled against re-downloading a dictionary it no longer has.
 */
export const deleteCachedDictionaries = async () => {
  await Promise.all([caches.delete('dictionary-api-cache'), caches.delete('dictionary-revalidated-at')]);
};

export const assertResult = (index: number, word: string, points: number) => {
  getResult(index).should('have.attr', 'aria-label', word).and('include.text', word);
  getResult(index).findByTestId('points').should('have.text', String(points));
};

export const unregisterServiceWorkers = async () => {
  const registrations = await navigator.serviceWorker.getRegistrations();
  return Promise.all(registrations.map((registration) => registration.unregister()));
};

export const moveMouseAway = () => {
  cy.window().then((window) => {
    cy.get('body').realMouseMove(window.innerWidth / 2, 0);
  });
};
