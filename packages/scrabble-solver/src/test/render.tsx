import { render, renderHook } from '@testing-library/react';
import { type PropsWithChildren, type ReactElement } from 'react';
import { Provider } from 'react-redux';

import type { RootState } from '../state/types';

import { type TestStore, createTestStore } from './store';

interface Options {
  sagas?: boolean;
  state?: Partial<RootState>;
  store?: TestStore;
}

export function renderWithStore(
  ui: ReactElement,
  { sagas, state, store = createTestStore({ sagas, state }) }: Options = {},
) {
  return { ...render(ui, { wrapper: createWrapper(store) }), store };
}

export function renderHookWithStore<Result>(
  hook: () => Result,
  { sagas, state, store = createTestStore({ sagas, state }) }: Options = {},
) {
  return { ...renderHook(hook, { wrapper: createWrapper(store) }), store };
}

function createWrapper(store: TestStore) {
  return function Wrapper({ children }: PropsWithChildren) {
    return <Provider store={store}>{children}</Provider>;
  };
}
