import { BLANK } from '@scrabble-solver/constants';
import classNames from 'classnames';
import React, { createRef, FunctionComponent, useCallback, useMemo, useState } from 'react';
import { useDispatch } from 'react-redux';

import { createKeyboardNavigation, zipCharactersAndTiles } from 'lib';
import {
  selectConfig,
  selectResultCandidate,
  selectTiles,
  solve,
  tiles as tilesSlice,
  useTranslation,
  useTypedSelector,
} from 'state';

import Tile from '../Tile';

import styles from './Tiles.module.scss';

interface Props {
  className?: string;
}

// TODO: Move this
const useTiles = () => {
  const resultCandidate = useTypedSelector(selectResultCandidate);
  const characters = useTypedSelector(selectTiles);
  const tiles = resultCandidate?.tiles || [];

  return zipCharactersAndTiles(characters, tiles).map(({ character, tile }) => ({
    character,
    isCandidate: tile !== null,
  }));
};

const Tiles: FunctionComponent<Props> = ({ className }) => {
  const dispatch = useDispatch();
  const config = useTypedSelector(selectConfig);
  const tiles = useTiles();
  const tilesRefs = useMemo(() => tiles.map(() => createRef<HTMLInputElement>()), [tiles]);
  const [activeIndex, setActiveIndex] = useState<number>();
  const placeholder = useTranslation('modules.tiles.placeholder');

  const handleCharacterChange = (index: number, character: string | null) => {
    dispatch(tilesSlice.actions.changeCharacter({ character, index }));
  };

  const handleSubmit = () => {
    dispatch(solve.actions.submit());
  };

  const changeActiveIndex = useCallback(
    (offset: number) => {
      const nextActiveIndex = Math.min(Math.max((activeIndex || 0) + offset, 0), tiles.length - 1);
      const tileRef = tilesRefs[nextActiveIndex].current;

      if (tileRef) {
        tileRef.focus();
      }

      setActiveIndex(nextActiveIndex);
    },
    [activeIndex, tiles, tilesRefs],
  );

  const onKeyDown = createKeyboardNavigation({
    onArrowLeft: (event) => {
      event.preventDefault();
      changeActiveIndex(-1);
    },
    onArrowRight: (event) => {
      event.preventDefault();
      changeActiveIndex(1);
    },
    onBackspace: () => {
      changeActiveIndex(-1);
    },
    onEnter: handleSubmit,
    onKeyDown: (event) => {
      const character = event.key;
      if (config.hasCharacter(character) || character === BLANK) {
        changeActiveIndex(1);
      }
    },
  });

  return (
    <div className={classNames(styles.tiles, className)}>
      {tiles.map(({ character, isCandidate }, index) => (
        <Tile
          className={styles.tile}
          // TODO: is this a hack?
          character={character === null ? undefined : character}
          highlighted={isCandidate}
          isBlank={character === BLANK}
          key={index}
          placeholder={placeholder[index]}
          raised
          ref={tilesRefs[index]}
          size={80} // TODO: unhardcode
          onFocus={() => setActiveIndex(index)}
          onKeyDown={createKeyboardNavigation({
            onBackspace: () => handleCharacterChange(index, null),
            onDelete: () => handleCharacterChange(index, null),
            onKeyDown: (event) => {
              if (config.hasCharacter(event.key) || event.key === BLANK) {
                handleCharacterChange(index, event.key);
              }
              onKeyDown(event);
            },
          })}
        />
      ))}
    </div>
  );
};

export default Tiles;
