import { type Store } from '@reduxjs/toolkit';
import { useStore } from 'react-redux';

import type { RootState } from './types';

export const useTypedStore = (): Store<RootState> => useStore<RootState>();
