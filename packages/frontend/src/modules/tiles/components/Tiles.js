import React, { createRef, useEffect, useMemo, useState } from 'react';
import { useDispatch } from 'react-redux';
import { BLANK } from '@scrabble-solver/constants';

import { createKeyboardNavigation } from 'utils';
import { useConfig } from 'config';
import { changeCharacter, submit } from 'tiles/state';
import { useTiles } from 'tiles/hooks';

import Tile from './Tile';
import styles from './Tiles.module.scss';

const Tiles = () => {
  const tiles = useTiles();
  const tilesRefs = useMemo(() => tiles.map(() => createRef()), [tiles]);
  const [activeIndex, setActiveIndex] = useState(null);
  const config = useConfig();
  const dispatch = useDispatch();

  useEffect(() => {
    if (activeIndex !== null) {
      tilesRefs[activeIndex].current.focus();
    }
  }, [activeIndex, tilesRefs]);

  const onKeyDown = createKeyboardNavigation({
    onArrowLeft: (event) => {
      event.preventDefault();
      setActiveIndex(Math.max(activeIndex - 1, 0));
    },
    onArrowRight: (event) => {
      event.preventDefault();
      setActiveIndex(Math.min(activeIndex + 1, tiles.length - 1));
    },
    onEnter: () => dispatch(submit())
  });

  return (
    <div className={styles.tiles}>
      {tiles.map((character, index) => (
        <Tile
          className={styles.tile}
          character={character}
          key={index}
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
