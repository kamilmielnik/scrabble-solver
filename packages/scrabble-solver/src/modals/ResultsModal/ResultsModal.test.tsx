import { fireEvent, screen } from '@testing-library/react';
import { describe, expect, it, mock } from 'bun:test';

import { resultsInitialState, resultsSlice } from '../../state/results';
import type { RootState } from '../../state/types';
import { createResult } from '../../test/fixtures';
import { setLayout } from '../../test/media';
import { renderWithStore } from '../../test/render';
import { installFixedSizeResizeObserver } from '../../test/virtualList';

import { ResultsModal } from './ResultsModal';

installFixedSizeResizeObserver();

const cat = createResult({ id: 1, points: 30, word: 'cat', x: 0, y: 0 });
const dog = createResult({ id: 2, points: 10, word: 'dog', x: 0, y: 1 });

describe('compact pointer layout', () => {
  it('picks a row on click and keeps the modal open', () => {
    setLayout({ isCompact: true });
    const { onClose, store } = setup();

    fireEvent.click(getRow(0));

    expect(store.getState().results.candidate).toBe(cat);
    expect(onClose).not.toHaveBeenCalled();
  });

  it('does nothing when the picked row is clicked again', () => {
    setLayout({ isCompact: true });
    const { onClose, store } = setup({ results: { ...resultsInitialState, candidate: cat, results: [cat, dog] } });

    fireEvent.click(getRow(0));

    expect(onClose).not.toHaveBeenCalled();
    expect(store.getState().results.candidate).toBe(cat);
  });

  it('ignores hover', () => {
    setLayout({ isCompact: true });
    const { store } = setup();

    fireEvent.mouseEnter(getRow(0));

    expect(store.getState().results.candidate).toBeNull();
  });

  it('marks the picked row', () => {
    setLayout({ isCompact: true });
    setup({ results: { ...resultsInitialState, candidate: dog, results: [cat, dog] } });

    expect(getRow(1).getAttribute('aria-current')).toBe('true');
    expect(getRow(1).closest('[dir]')).not.toBeNull();
  });
});

describe('compact touch layout', () => {
  it('previews by closing when the picked row is tapped again', () => {
    setLayout({ isCompact: true, isTouch: true });
    const { onClose, store } = setup({ results: { ...resultsInitialState, candidate: cat, results: [cat, dog] } });

    fireEvent.click(getRow(0));

    expect(onClose).toHaveBeenCalledTimes(1);
    expect(store.getState().results.candidate).toBe(cat);
  });

  it('picks another row on tap', () => {
    setLayout({ isCompact: true, isTouch: true });
    const { onClose, store } = setup({ results: { ...resultsInitialState, candidate: cat, results: [cat, dog] } });

    fireEvent.click(getRow(1));

    expect(store.getState().results.candidate).toBe(dog);
    expect(onClose).not.toHaveBeenCalled();
  });
});

describe('footer', () => {
  it('disables both buttons without a pick', () => {
    setLayout({ isCompact: true });
    setup();

    expect(getInsert().disabled).toBe(true);
    expect(getPreview().disabled).toBe(true);
  });

  it('inserts the pick and closes', () => {
    setLayout({ isCompact: true });
    const { onClose, store } = setup({ results: { ...resultsInitialState, candidate: cat, results: [cat, dog] } });

    fireEvent.click(getInsert());

    expect(store.actions.at(-1)).toEqual(resultsSlice.actions.applyResult(cat));
    expect(onClose).toHaveBeenCalledTimes(1);
  });

  it('previews by closing and keeping the pick', () => {
    setLayout({ isCompact: true });
    const { onClose, store } = setup({ results: { ...resultsInitialState, candidate: cat, results: [cat, dog] } });

    fireEvent.click(getPreview());

    expect(onClose).toHaveBeenCalledTimes(1);
    expect(store.getState().results.candidate).toBe(cat);
  });
});

describe('desktop layout', () => {
  it('closes itself, because the results are in the sidebar', () => {
    setLayout({ isCompact: false });
    const { onClose } = setup();

    expect(onClose).toHaveBeenCalledTimes(1);
  });

  it('does not ask to close while already closed', () => {
    setLayout({ isCompact: false });
    const { onClose } = setup({}, false);

    expect(onClose).not.toHaveBeenCalled();
  });
});

function setup(state: Partial<RootState> = {}, isOpen = true) {
  const onClose = mock();
  const view = renderWithStore(<ResultsModal isOpen={isOpen} onClose={onClose} />, {
    state: { rack: [null], results: { ...resultsInitialState, results: [cat, dog] }, ...state },
  });

  return { ...view, onClose };
}

function getRow(index: number): HTMLElement {
  return document.querySelectorAll<HTMLElement>('[data-testid="result"]')[index];
}

function getInsert(): HTMLButtonElement {
  return screen.getByRole('button', { name: 'Insert' });
}

function getPreview(): HTMLButtonElement {
  return screen.getByRole('button', { name: 'Preview' });
}
