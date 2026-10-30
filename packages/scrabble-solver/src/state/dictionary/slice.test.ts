import { type WordDefinition } from '@scrabble-solver/types';

import type { RootState } from '../types';

import { dictionaryInitialState } from './initialState';
import {
  selectDictionary,
  selectDictionaryError,
  selectDictionaryInput,
  selectDictionaryIsLoading,
  selectDictionaryResults,
} from './selectors';
import { dictionarySlice } from './slice';

const { actions, reducer } = dictionarySlice;
const definitions = [{ word: 'cat' }] as unknown as WordDefinition[];

describe('dictionarySlice', () => {
  it('keeps the rest of the state when the input changes', () => {
    const state = { ...dictionaryInitialState, results: definitions };

    expect(reducer(state, actions.changeInput('dog'))).toEqual({ ...state, input: 'dog' });
  });

  it('starts loading and discards previous results and error on submit', () => {
    const state = { ...dictionaryInitialState, error: new Error('x'), input: 'cat', results: definitions };

    expect(reducer(state, actions.submit())).toEqual({
      error: undefined,
      input: 'cat',
      isLoading: true,
      results: [],
    });
  });

  it('stores the error and stops loading on failure', () => {
    const error = new Error('x');
    const state = { ...dictionaryInitialState, isLoading: true, results: definitions };

    expect(reducer(state, actions.submitFailure(error))).toEqual({
      error,
      input: '',
      isLoading: false,
      results: [],
    });
  });

  it('stores results and clears the error on success', () => {
    const state = { ...dictionaryInitialState, error: new Error('x'), isLoading: true };

    expect(reducer(state, actions.submitSuccess(definitions))).toEqual({
      error: undefined,
      input: '',
      isLoading: false,
      results: definitions,
    });
  });

  it('resets to the initial state', () => {
    expect(reducer({ ...dictionaryInitialState, input: 'cat' }, actions.reset())).toBe(dictionaryInitialState);
  });
});

describe('selectors', () => {
  const dictionary = { error: new Error('x'), input: 'cat', isLoading: true, results: definitions };
  const state = { dictionary } as RootState;

  it('selects each field', () => {
    expect(selectDictionary(state)).toBe(dictionary);
    expect(selectDictionaryInput(state)).toBe('cat');
    expect(selectDictionaryIsLoading(state)).toBe(true);
    expect(selectDictionaryResults(state)).toBe(definitions);
  });

  it('exposes only real errors', () => {
    expect(selectDictionaryError(state)).toBe(dictionary.error);
    expect(
      selectDictionaryError({ dictionary: { ...dictionary, error: 'plain string' } } as RootState),
    ).toBeUndefined();
  });
});
