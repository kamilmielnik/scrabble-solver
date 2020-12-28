import { useSelector, TypedUseSelectorHook } from 'react-redux';

import { RootState } from './reducers';

const useTypedSelector: TypedUseSelectorHook<RootState> = useSelector;

export default useTypedSelector;
