import { useSelector } from 'react-redux';
import { selectConfig } from './selectors';

export const useConfig = () => {
  return useSelector(selectConfig);
};
