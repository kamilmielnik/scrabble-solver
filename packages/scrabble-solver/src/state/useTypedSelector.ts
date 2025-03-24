import { TypedUseSelectorHook, useSelector } from 'react-redux';

import { RootState } from './types';

export const useTypedSelector: TypedUseSelectorHook<RootState> = useSelector;
