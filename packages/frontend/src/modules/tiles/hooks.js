import { useSelector } from 'react-redux';
import { selectTiles } from './selectors';

export const useTiles = () => {
  return useSelector(selectTiles);
};
