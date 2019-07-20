import { useSelector } from 'react-redux';
import { selectIsLoading, selectResultCandidate } from './selectors';

export const useIsLoading = () => useSelector(selectIsLoading);

export const useResultCandidate = () => useSelector(selectResultCandidate);
