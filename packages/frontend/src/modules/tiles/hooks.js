import { useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import { useResultCandidate } from 'result-candidate';

import { selectCharacters } from './selectors';
import { changeCharacter, submit } from './state';
import { zipCharactersAndTiles } from './utils';

export const useChangeCharacter = () => {
  const dispatch = useDispatch();

  return useCallback((index, character) => dispatch(changeCharacter({ index, character })), [dispatch]);
};

export const useCharacters = () => useSelector(selectCharacters);

export const useSubmit = () => {
  const dispatch = useDispatch();

  return useCallback(() => dispatch(submit()), [dispatch]);
};

export const useTiles = () => {
  const resultCandidate = useResultCandidate();
  const characters = useCharacters();
  const tiles = (resultCandidate && resultCandidate.tiles) || [];

  return zipCharactersAndTiles(characters, tiles).map(({ character, tile }) => ({
    character,
    isCandidate: tile !== null
  }));
};
