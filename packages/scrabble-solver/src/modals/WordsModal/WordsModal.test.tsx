/* eslint-disable max-lines */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */

import { Locale } from '@scrabble-solver/types';
import { act, fireEvent, screen } from '@testing-library/react';
import { describe, expect, it, mock } from 'bun:test';

import { noop } from '../../lib/noop';
import { hoveredWordSlice } from '../../state/hoveredWord';
import { settingsInitialState } from '../../state/settings';
import type { RootState } from '../../state/types';
import { verifyInitialState, verifySlice } from '../../state/verify';
import { createVerifiedWord } from '../../test/fixtures';
import { setLayout } from '../../test/media';
import { renderWithStore } from '../../test/render';
import { installFixedSizeResizeObserver } from '../../test/virtualList';
import { SortDirection, WordColumnId } from '../../types';

import { WordsModal } from './WordsModal';

installFixedSizeResizeObserver();

const cat = createVerifiedWord({ word: 'cat', x: 0, y: 0 });
const dog = createVerifiedWord({ isValid: false, word: 'dog', x: 0, y: 2 });
const verify = { ...verifyInitialState, invalidWords: [dog], validWords: [cat] };

describe('empty board', () => {
  it('swaps the list for an empty state and hides search', () => {
    setup({ verify: verifyInitialState });

    expect(screen.getByText('No created words - the board is empty.')).toBeDefined();
    expect(screen.queryByPlaceholderText(/Search words/)).toBeNull();
    expect(screen.queryAllByRole('button', { name: 'cat' })).toHaveLength(0);
  });

  it('keeps the column headers', () => {
    setup({ verify: verifyInitialState });

    expect(screen.getByRole('button', { name: 'Word' })).toBeDefined();
  });

  it('selects nothing in the compact layout', () => {
    setLayout({ isCompact: true });
    const { store } = setup({ verify: verifyInitialState });

    expect(store.getState().hoveredWord.word).toBeNull();
  });
});

describe('list', () => {
  it('renders words sorted by word by default, with coordinates and validity', () => {
    setup();

    expect(readWords()).toEqual(['cat', 'dog']);
    expect(getRow(cat).textContent).toContain('1A');
    expect(getRow(cat).querySelector('[role="img"]')?.getAttribute('aria-label')).toBe('Valid');
    expect(getRow(dog).querySelector('[role="img"]')?.getAttribute('aria-label')).toBe('Invalid');
  });

  it('identifies a word by position and direction, not by text', () => {
    const across = createVerifiedWord({ word: 'cat', x: 0, y: 0 });
    const down = createVerifiedWord({ direction: 'vertical', word: 'cat', x: 0, y: 0 });

    setup({ hoveredWord: { word: down }, verify: { ...verifyInitialState, validWords: [across, down] } });

    expect(getRow(across).getAttribute('aria-current')).toBeNull();
    expect(getRow(down).getAttribute('aria-current')).toBe('true');
  });

  it('renders right-to-left for a right-to-left locale', () => {
    setup({ settings: { ...settingsInitialState, locale: Locale.FA_IR } });

    expect(getRow(cat).closest('[dir]')?.getAttribute('dir')).toBe('rtl');
  });
});

describe('list updates', () => {
  it('drops rows when the board loses a word, without a row reading past the end of the list', () => {
    const { store } = setup();

    act(() => {
      store.dispatch(
        verifySlice.actions.submitSuccess({ board: store.getState().board, invalidWords: [], validWords: [cat] }),
      );
    });

    expect(readWords()).toEqual(['cat']);
  });
});

describe('sorting and search', () => {
  it('sorts by each column', () => {
    const { store } = setup();

    fireEvent.click(screen.getByRole('button', { name: 'Validity' }));
    expect(store.getState().verify.sort.column).toBe(WordColumnId.Validity);
    expect(readWords()).toEqual(['dog', 'cat']);

    fireEvent.click(screen.getByRole('button', { name: 'Coordinates' }));
    expect(store.getState().verify.sort.column).toBe(WordColumnId.Coordinates);
  });

  it('toggles direction on the active column', () => {
    const { store } = setup();

    fireEvent.click(screen.getByRole('button', { name: 'Word' }));

    expect(store.getState().verify.sort.direction).toBe(SortDirection.Descending);
    expect(readWords()).toEqual(['dog', 'cat']);
  });

  it('floats matches to the top and dims the rest without removing rows', () => {
    setup();

    fireEvent.change(screen.getByPlaceholderText(/Search words/), { target: { value: 'dog' } });

    expect(readWords()).toEqual(['dog', 'cat']);
    expect(document.querySelectorAll('[data-testid^="word-"]')[0].getAttribute('aria-hidden')).toBeNull();
    expect(document.querySelectorAll('[data-testid^="word-"]')[1].getAttribute('aria-hidden')).toBe('true');
    expect(document.querySelector('mark')?.textContent).toBe('dog');
  });

  /**
   * #461 - Highlighting ignores regular expressions in filters
   * @see https://github.com/kamilmielnik/scrabble-solver/issues/461
   */
  it('highlights the matches of a regular expression (#461)', () => {
    setup({ verify: { ...verify, query: '^d|t$' } });

    expect(Array.from(document.querySelectorAll('mark'), (mark) => mark.textContent).toSorted()).toEqual(['d', 't']);
  });

  it('marks nothing for a blank query', () => {
    setup();

    expect(document.querySelector('mark')).toBeNull();
  });
});

describe('desktop with a pointer, where the pointer owns the highlight', () => {
  /**
   * #427 - Highlight created words on board on hover
   * @see https://github.com/kamilmielnik/scrabble-solver/issues/427
   */
  it('picks on hover and clears on leaving the list (#427)', () => {
    const { store } = setup();

    fireEvent.mouseEnter(getRow(cat));
    expect(store.getState().hoveredWord.word).toEqual(cat);

    fireEvent.mouseLeave(getRow(cat).closest('[dir]')!);
    expect(store.getState().hoveredWord.word).toBeNull();
  });

  it('picks on focus and clears on blur', () => {
    const { store } = setup();

    fireEvent.focus(getRow(cat));
    expect(store.getState().hoveredWord.word).toEqual(cat);

    fireEvent.blur(getRow(cat));
    expect(store.getState().hoveredWord.word).toBeNull();
  });

  it('adds nothing on click and does not advertise one', () => {
    const { onPreview, store } = setup();

    fireEvent.click(getRow(cat));

    expect(store.getState().hoveredWord.word).toBeNull();
    expect(onPreview).not.toHaveBeenCalled();
    expect(getRow(cat).className).not.toContain('clickable');
  });

  it('shows no footer', () => {
    setup();

    expect(screen.queryByRole('button', { name: 'Preview' })).toBeNull();
  });

  it('selects nothing on open', () => {
    const { store } = setup();

    expect(store.getState().hoveredWord.word).toBeNull();
  });
});

describe('losing the last word', () => {
  it('returns to the empty state', () => {
    const { store } = setup({ verify: { ...verify, invalidWords: [] } });

    act(() => {
      store.dispatch(
        verifySlice.actions.submitSuccess({ board: store.getState().board, invalidWords: [], validWords: [] }),
      );
    });

    expect(screen.getByText('No created words - the board is empty.')).toBeDefined();
    expect(readWords()).toEqual([]);
  });
});

describe.each([
  ['compact pointer', { isCompact: true, isTouch: false }],
  ['compact touch', { isCompact: true, isTouch: true }],
  ['desktop touch', { isCompact: false, isTouch: true }],
])('%s layout, where the highlight is sticky', (_name, layout) => {
  it('picks on click', () => {
    setLayout(layout);
    const { store } = setup();

    fireEvent.click(getRow(dog));

    expect(store.getState().hoveredWord.word).toEqual(dog);
    expect(getRow(dog).className).toContain('clickable');
  });

  it('ignores hover and leaving the list', () => {
    setLayout(layout);
    const { store } = setup({ hoveredWord: { word: dog } });

    fireEvent.mouseEnter(getRow(cat));
    expect(store.getState().hoveredWord.word).toEqual(dog);

    fireEvent.mouseLeave(getRow(cat).closest('[dir]')!);
    expect(store.getState().hoveredWord.word).toEqual(dog);
  });

  it('ignores focus and blur', () => {
    setLayout(layout);
    const { store } = setup({ hoveredWord: { word: dog } });

    fireEvent.focus(getRow(cat));
    fireEvent.blur(getRow(cat));

    expect(store.getState().hoveredWord.word).toEqual(dog);
  });
});

describe('repeated click on the picked row', () => {
  it('previews on touch', () => {
    setLayout({ isCompact: true, isTouch: true });
    const { onPreview } = setup({ hoveredWord: { word: cat } });

    fireEvent.click(getRow(cat));

    expect(onPreview).toHaveBeenCalledTimes(1);
  });

  it('previews on touch in the desktop layout too', () => {
    setLayout({ isCompact: false, isTouch: true });
    const { onPreview } = setup({ hoveredWord: { word: cat } });

    fireEvent.click(getRow(cat));

    expect(onPreview).toHaveBeenCalledTimes(1);
  });

  it('does nothing without touch', () => {
    setLayout({ isCompact: true });
    const { onPreview, store } = setup({ hoveredWord: { word: cat } });

    fireEvent.click(getRow(cat));

    expect(onPreview).not.toHaveBeenCalled();
    expect(store.getState().hoveredWord.word).toEqual(cat);
  });
});

describe('compact layout', () => {
  it('selects the first word on open, because the modal covers the board', () => {
    setLayout({ isCompact: true });
    const { store } = setup();

    expect(store.getState().hoveredWord.word).toEqual(cat);
  });

  it('keeps an existing pick', () => {
    setLayout({ isCompact: true });
    const { store } = setup({ hoveredWord: { word: dog } });

    expect(store.getState().hoveredWord.word).toEqual(dog);
  });

  it('does not select while closed', () => {
    setLayout({ isCompact: true });
    const { store } = setup({}, { isOpen: false });

    expect(store.getState().hoveredWord.word).toBeNull();
  });

  it('offers Preview in the footer, disabled without a pick', () => {
    setLayout({ isCompact: true });
    const { store } = setup({ verify: verifyInitialState });

    expect(getPreview().disabled).toBe(true);
    expect(store.getState().hoveredWord.word).toBeNull();
  });

  it('previews from the footer', () => {
    setLayout({ isCompact: true });
    const { onPreview } = setup();

    fireEvent.click(getPreview());

    expect(onPreview).toHaveBeenCalledTimes(1);
  });
});

describe('closing', () => {
  /**
   * #427 - Highlight created words on board on hover
   * @see https://github.com/kamilmielnik/scrabble-solver/issues/427
   */
  it('clears the highlight on every way out (#427)', () => {
    const { rerender, store } = setup();

    act(() => {
      store.dispatch(hoveredWordSlice.actions.set(cat));
    });
    rerender(createModal({ isOpen: false }));

    expect(store.getState().hoveredWord.word).toBeNull();
  });

  it('keeps the highlight standing after Preview, which leaves through the footer', () => {
    setLayout({ isCompact: true });
    const { rerender, store } = setup();

    fireEvent.click(getPreview());
    rerender(createModal({ isOpen: false }));

    expect(store.getState().hoveredWord.word).toEqual(cat);
  });

  it('clears on the next close after a preview', () => {
    setLayout({ isCompact: true });
    const { rerender, store } = setup();

    fireEvent.click(getPreview());
    rerender(createModal({ isOpen: false }));
    rerender(createModal({ isOpen: true }));
    rerender(createModal({ isOpen: false }));

    expect(store.getState().hoveredWord.word).toBeNull();
  });
});

interface ModalProps {
  isOpen?: boolean;
  onClose?: () => void;
  onPreview?: () => void;
}

function createModal({ isOpen = true, onClose = noop, onPreview = noop }: ModalProps) {
  return <WordsModal isOpen={isOpen} onClose={onClose} onPreview={onPreview} />;
}

function setup(state: Partial<RootState> = {}, { isOpen = true }: ModalProps = {}) {
  const onPreview = mock();
  const view = renderWithStore(createModal({ isOpen, onPreview }), { state: { verify, ...state } });

  return { ...view, onPreview };
}

function getRow(word: typeof cat): HTMLElement {
  return screen.getByTestId(`word-${word.x}-${word.y}-${word.direction}`, { exact: false }) as HTMLElement;
}

function getPreview(): HTMLButtonElement {
  return screen.getByRole('button', { name: 'Preview' });
}

function readWords(): (string | null)[] {
  return Array.from(document.querySelectorAll('[data-testid^="word-"]'), (row) => row.getAttribute('aria-label'));
}
