import { useSelector } from 'react-redux';

import { selectIsLoading } from './selectors';

export const useIsLoading = () => useSelector(selectIsLoading);
