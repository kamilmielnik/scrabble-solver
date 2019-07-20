import React, { createRef, useCallback, useEffect, useMemo, useState } from 'react';
import { useDispatch } from 'react-redux';
import { BLANK } from '@scrabble-solver/constants';

import { createKeyboardNavigation } from 'utils';
import { useConfig } from 'config';
import { changeCharacter, submit } from 'tiles/state';
import { useTiles } from 'tiles/hooks';
import { useMessage } from 'i18n';

import Tile from './Tile';
import styles from './Tiles.module.scss';

const Tiles = () => {
  const tiles = useTiles();
  const tilesRefs = useMemo(() => tiles.map(() => createRef()), [tiles]);
  const [activeIndex, setActiveIndex] = useState(null);
  const config = useConfig();
  const dispatch = useDispatch();
  const placeholder = useMessage({ id: 'modules.tiles.placeholder' });

  const changeActiveIndex = useCallback(
    (offset) => {
      const nextActiveIndex = Math.min(Math.max(activeIndex + offset, 0), tiles.length - 1);
      tilesRefs[nextActiveIndex].current.focus();
      setActiveIndex(nextActiveIndex);
    },
    [activeIndex, tiles, tilesRefs]
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
    onEnter: () => dispatch(submit()),
    onKeyDown: (event) => {
      const character = event.key;
      if (config.hasCharacter(character) || character === BLANK) {
        changeActiveIndex(1);
      }
    }
  });

  return (
    <div className={styles.tiles}>
      {tiles.map(({ character, isCandidate }, index) => (
        <Tile
          className={styles.tile}
          character={character}
          isCandidate={isCandidate}
          key={index}
          placeholder={placeholder[index]}
          ref={tilesRefs[index]}
          onFocus={() => setActiveIndex(index)}
          onKeyDown={createKeyboardNavigation({
            onBackspace: () => dispatch(changeCharacter({ index, character: null })),
            onDelete: () => dispatch(changeCharacter({ index, character: null })),
            onKeyDown: (event) => {
              const character = event.key;
              if (config.hasCharacter(character) || character === BLANK) {
                dispatch(changeCharacter({ index, character }));
              }
              onKeyDown(event);
            }
          })}
        />
      ))}
    </div>
  );
};

export default Tiles;
