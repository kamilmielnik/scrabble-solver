import { TypedUseSelectorHook, useSelector } from 'react-redux';

import { RootState } from './types';

const useTypedSelector: TypedUseSelectorHook<RootState> = useSelector;

export default useTypedSelector;
