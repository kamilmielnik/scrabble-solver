import { type TypedUseSelectorHook, useSelector } from 'react-redux';

import type { RootState } from './types';

const useTypedSelector: TypedUseSelectorHook<RootState> = useSelector;

export default useTypedSelector;
