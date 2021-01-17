import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { useEffectOnce } from 'react-use';

import { localStorage, selectTiles, tilesSlice, useTypedSelector } from 'state';

const useLocalStorageTiles = () => {
  const dispatch = useDispatch();
  const tiles = useTypedSelector(selectTiles);

  useEffectOnce(() => {
    const persistedTiles = localStorage.getTiles();

    if (persistedTiles) {
      dispatch(tilesSlice.actions.init(persistedTiles));
    }
  });

  useEffect(() => {
    if (tiles) {
      localStorage.setTiles(tiles);
    }
  }, [tiles]);
};

export default useLocalStorageTiles;
