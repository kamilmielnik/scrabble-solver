import React, { createRef, useCallback, useMemo, useState } from 'react';
import PropTypes from 'prop-types';
import { BLANK } from '@scrabble-solver/constants';

import { Tile } from 'components';
import { createKeyboardNavigation } from 'utils';
import { useConfig } from 'config';
import { useMessage } from 'i18n';

import { useChangeCharacter, useSubmit, useTiles } from './hooks';
import styles from './Tiles.module.scss';

const Tiles = ({ id }) => {
  const tiles = useTiles();
  const tilesRefs = useMemo(() => tiles.map(() => createRef()), [tiles]);
  const [activeIndex, setActiveIndex] = useState(null);
  const config = useConfig();
  const placeholder = useMessage({ id: 'modules.tiles.placeholder' });
  const changeCharacter = useChangeCharacter();
  const submit = useSubmit();

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
    onEnter: submit,
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
          isBlank={character === BLANK}
          key={index}
          placeholder={placeholder[index]}
          ref={tilesRefs[index]}
          onFocus={() => setActiveIndex(index)}
          onKeyDown={createKeyboardNavigation({
            onBackspace: () => changeCharacter(index, null),
            onDelete: () => changeCharacter(index, null),
            onKeyDown: (event) => {
              const character = event.key;
              if (config.hasCharacter(character) || character === BLANK) {
                changeCharacter(index, character);
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
