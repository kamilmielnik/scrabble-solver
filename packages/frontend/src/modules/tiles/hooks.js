import { useSelector } from 'react-redux';
import { BLANK } from '@scrabble-solver/constants';

import { selectResultCandidate } from 'shared';

import { selectTiles } from './selectors';

export const useTiles = () => {
  const resultCandidate = useSelector(selectResultCandidate);
  const tiles = useSelector(selectTiles);

  if (!resultCandidate) {
    return tiles.map((character) => ({
      character,
      isCandidate: false
    }));
  }

  let remainingCandidateTiles = [...resultCandidate.tiles];

  return tiles.map((character) => {
    const index = remainingCandidateTiles.findIndex((tile) => {
      return character === BLANK ? tile.isBlank : character === tile.character;
    });

    if (index >= 0) {
      remainingCandidateTiles = [
        ...remainingCandidateTiles.slice(0, index),
        ...remainingCandidateTiles.slice(index + 1)
      ];
    }

    return {
      character,
      isCandidate: index >= 0
    };
  });
};
