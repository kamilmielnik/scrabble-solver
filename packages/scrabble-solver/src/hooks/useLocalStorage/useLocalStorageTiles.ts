import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { useEffectOnce } from 'react-use';

import { localStorage, selectTiles, tilesSlice, useTypedSelector } from 'state';

const useLocalStorageTiles = () => {
  const dispatch = useDispatch();
  const tiles = useTypedSelector(selectTiles);

  useEffectOnce(() => {
    if (localStorage.tiles) {
      dispatch(tilesSlice.actions.change(localStorage.tiles));
    }
  });

  useEffect(() => {
    if (tiles) {
      localStorage.tiles = tiles;
    }
  }, [tiles]);
};

export default useLocalStorageTiles;
