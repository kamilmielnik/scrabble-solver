import { BLANK } from '@scrabble-solver/constants';
import classNames from 'classnames';
import React, { createRef, FunctionComponent, useCallback, useMemo, useRef } from 'react';

import { createArray, createKeyboardNavigation, zipCharactersAndTiles } from 'lib';
import { selectConfig, selectRack, selectResultCandidateTiles, useTypedSelector } from 'state';

import styles from './Rack.module.scss';
import RackTile from './RackTile';

interface Props {
  className?: string;
}

const Rack: FunctionComponent<Props> = ({ className }) => {
  const config = useTypedSelector(selectConfig);
  const rack = useTypedSelector(selectRack);
  const resultCandidateTiles = useTypedSelector(selectResultCandidateTiles);
  const tiles = useMemo(() => zipCharactersAndTiles(rack, resultCandidateTiles), [rack, resultCandidateTiles]);
  const tilesCount = tiles.length;
  const tilesRefs = useMemo(() => createArray(tilesCount).map(() => createRef<HTMLInputElement>()), [tilesCount]);
  const activeIndexRef = useRef<number>();

  const changeActiveIndex = useCallback(
    (offset: number) => {
      const nextActiveIndex = Math.min(Math.max((activeIndexRef.current || 0) + offset, 0), tilesCount - 1);
      const tileRef = tilesRefs[nextActiveIndex].current;

      if (tileRef) {
        tileRef.focus();
      }

      activeIndexRef.current = nextActiveIndex;
    },
    [activeIndexRef, tilesCount, tilesRefs],
  );

  const onKeyDown = useMemo(() => {
    return createKeyboardNavigation({
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
      onKeyDown: (event) => {
        const character = event.key.toLowerCase();

        if (config.hasCharacter(character) || character === BLANK) {
          changeActiveIndex(1);
        }
      },
    });
  }, [changeActiveIndex, config]);

  return (
    <div className={classNames(styles.rack, className)}>
      {tiles.map(({ character, tile }, index) => (
        <RackTile
          activeIndexRef={activeIndexRef}
          character={character}
          index={index}
          inputRef={tilesRefs[index]}
          key={index}
          tile={tile}
          onKeyDown={onKeyDown}
        />
      ))}
    </div>
  );
};

export default Rack;
