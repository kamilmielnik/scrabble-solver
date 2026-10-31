import { Locale, WordDefinition } from '@scrabble-solver/types';
import { fireEvent, screen } from '@testing-library/react';
import { describe, expect, it } from 'bun:test';

import english from '../../i18n/languages/english.json';
import { dictionaryInitialState, dictionarySlice } from '../../state/dictionary';
import { settingsInitialState } from '../../state/settings';
import type { RootState } from '../../state/types';
import { renderWithStore } from '../../test/render';
import { DictionaryInput } from '../DictionaryInput';

import { Dictionary } from './Dictionary';

describe('Dictionary', () => {
  it('invites to search before the first lookup', () => {
    setup();

    expect(screen.getByText(english['dictionary.empty-state.uninitialized'])).toBeDefined();
  });

  it('shows the error', () => {
    setup({ error: new Error('Lookup failed') });

    expect(screen.getByText('Lookup failed')).toBeDefined();
  });

  it('hides the empty and error states while loading', () => {
    setup({ error: new Error('Lookup failed'), isLoading: true });

    expect(screen.queryByText('Lookup failed')).toBeNull();
    expect(screen.queryByText(english['dictionary.empty-state.uninitialized'])).toBeNull();
    expect(screen.getByTestId('loading')).toBeDefined();
  });

  it('lists definitions of an allowed word', () => {
    setup({ results: [createDefinition({ definitions: ['a pet', 'a tool'] })] });

    expect(screen.getByRole('heading', { name: 'cat' })).toBeDefined();
    expect(screen.getAllByRole('listitem').map((item) => item.textContent)).toEqual(['a pet', 'a tool']);
    expect(document.querySelector('.isAllowed')).not.toBeNull();
  });

  it('says when an existing allowed word has no definitions', () => {
    setup({ results: [createDefinition({ definitions: [], exists: true })] });

    expect(screen.getByText(englishKey('dictionary.empty-state.no-definitions'))).toBeDefined();
  });

  it('says when an allowed word is unknown to the online dictionary', () => {
    setup({ results: [createDefinition({ definitions: [], exists: false })] });

    expect(screen.getByText(englishKey('dictionary.empty-state.no-results'))).toBeDefined();
  });

  it('says when the word is not allowed in the game', () => {
    setup({ results: [createDefinition({ isAllowed: false })] });

    expect(screen.getByText(englishKey('dictionary.empty-state.not-allowed'))).toBeDefined();
    expect(document.querySelector('.isNotAllowed')).not.toBeNull();
  });

  it('says there are no results when allowance is unknown', () => {
    setup({ results: [createDefinition({ definitions: [], isAllowed: null as never })] });

    expect(screen.getByText(englishKey('dictionary.empty-state.no-results'))).toBeDefined();
  });

  it('omits the heading of a result without a word', () => {
    setup({ results: [createDefinition({ word: '' })] });

    expect(screen.queryByRole('heading', { level: 2 })).toBeNull();
  });

  it('lists several words', () => {
    setup({ results: [createDefinition({ word: 'cat' }), createDefinition({ word: 'dog' })] });

    expect(screen.getAllByRole('heading').map((heading) => heading.textContent)).toEqual(['cat', 'dog']);
  });
});

describe('DictionaryInput', () => {
  it('writes the input to the store', () => {
    const { store } = renderWithStore(<DictionaryInput />);

    fireEvent.change(getInput(), { target: { value: 'cat' } });

    expect(store.getState().dictionary.input).toBe('cat');
    expect(getInput().value).toBe('cat');
  });

  it('submits without reloading the page', () => {
    const { store } = renderWithStore(<DictionaryInput />);

    expect(fireEvent.submit(getInput().closest('form')!)).toBe(false);
    expect(store.actions.at(-1)).toEqual(dictionarySlice.actions.submit());
  });

  it('requires something other than spaces and commas of the locale', () => {
    const { unmount } = renderWithStore(<DictionaryInput />);

    expect(getInput().required).toBe(true);
    expect(getInput().pattern).toBe('.*[^\\s,].*');
    unmount();

    renderWithStore(<DictionaryInput />, {
      state: { settings: { ...settingsInitialState, locale: Locale.FA_IR } },
    });

    expect(getInput().pattern).toBe('.*[^\\s،].*');
  });
});

function setup(dictionary: Partial<RootState['dictionary']> = {}) {
  return renderWithStore(<Dictionary />, { state: { dictionary: { ...dictionaryInitialState, ...dictionary } } });
}

function createDefinition(overrides: Partial<WordDefinition> = {}): WordDefinition {
  return new WordDefinition({ definitions: ['a pet'], exists: true, isAllowed: true, word: 'cat', ...overrides });
}

function getInput(): HTMLInputElement {
  return document.querySelector('input')!;
}

function englishKey(key: keyof typeof english): string {
  return english[key];
}
