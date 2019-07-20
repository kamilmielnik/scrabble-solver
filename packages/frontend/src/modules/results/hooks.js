import { useSelector } from 'react-redux';
import { selectFormattedResults } from './selectors';

export const useResults = () => {
  return useSelector(selectFormattedResults);
};
