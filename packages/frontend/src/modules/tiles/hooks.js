import { useSelector } from 'react-redux';

import { useResultCandidate } from 'shared';

import { selectCharacters } from './selectors';
import { zipCharactersAndTiles } from './utils';

export const useCharacters = () => useSelector(selectCharacters);

export const useTiles = () => {
  const resultCandidate = useResultCandidate();
  const characters = useCharacters();
  const tiles = (resultCandidate && resultCandidate.tiles) || [];

  return zipCharactersAndTiles(characters, tiles).map(({ character, tile }) => ({
    character,
    isCandidate: tile !== null
  }));
};
