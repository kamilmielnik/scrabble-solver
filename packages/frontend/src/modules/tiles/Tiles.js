import React, { createRef, useCallback, useMemo, useState } from 'react';
import PropTypes from 'prop-types';
import { useDispatch } from 'react-redux';
import { BLANK } from '@scrabble-solver/constants';

import { Tile } from 'components';
import { createKeyboardNavigation } from 'utils';
import { useConfig } from 'config';
import { useMessage } from 'i18n';

import { useTiles } from './hooks';
import { changeCharacter, submit } from './state';
import styles from './Tiles.module.scss';

const Tiles = ({ id }) => {
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
    <div className={styles.tiles} id={id}>
      {tiles.map(({ character, isCandidate }, index) => (
        <Tile
          className={styles.tile}
          character={character}
          highlighted={isCandidate}
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

Tiles.propTypes = {
  id: PropTypes.string
};

export default Tiles;
