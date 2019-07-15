import React, { createRef, useEffect, useMemo, useState } from 'react';
import PropTypes from 'prop-types';
import { useDispatch } from 'react-redux';

import { createKeyboardNavigation } from 'utils';
import Tile from 'components/tile';
import { useConfig } from 'config';
import { changeCharacter, submit } from 'tiles/state';
import { useTiles } from 'tiles/hooks';

import styles from './tiles.module.scss';

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

  return (
    <div className={styles.tiles}>
      {tiles.map((character, index) => (
        <Tile
          character={character}
          key={index}
          ref={tilesRefs[index]}
          onFocus={() => setActiveIndex(index)}
          onKeyDown={createKeyboardNavigation({
            onArrowLeft: (event) => {
              event.preventDefault();
              setActiveIndex(Math.max(activeIndex - 1, 0));
            },
            onArrowRight: (event) => {
              event.preventDefault();
              setActiveIndex(Math.min(activeIndex + 1, tiles.length - 1));
            },
            onBackspace: () => dispatch(changeCharacter({ index, character: null })),
            onDelete: () => dispatch(changeCharacter({ index, character: null })),
            onEnter: () => dispatch(submit()),
            onKeyDown: (event) => {
              if (config.hasCharacter(event.key)) {
                dispatch(changeCharacter({ index, character: event.key }));
              }
            }
          })}
        />
      ))}
    </div>
  );
};

export default Tiles;
