import { type TypedUseSelectorHook, useSelector } from 'react-redux';

import type { RootState } from './types';

export const useTypedSelector: TypedUseSelectorHook<RootState> = useSelector;
