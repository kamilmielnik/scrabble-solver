import classNames from 'classnames';
import { ChangeEvent, createRef, FunctionComponent, useCallback, useMemo, useRef } from 'react';

import { createArray, createKeyboardNavigation, isCtrl, zipCharactersAndTiles } from 'lib';
import { selectConfig, selectRack, selectResultCandidateTiles, useTypedSelector } from 'state';

import extractCharacters from './extractCharacters';
import extractInputValue from './extractInputValue';
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

  const handleChange = useCallback(
    (event: ChangeEvent<HTMLInputElement>) => {
      const value = extractInputValue(event.target);
      const characters = value ? extractCharacters(config, value) : [];
      changeActiveIndex(characters.length);
    },
    [changeActiveIndex, config],
  );

  const handleKeyDown = useMemo(() => {
    return createKeyboardNavigation({
      onArrowLeft: (event) => {
        event.preventDefault();
        changeActiveIndex(-1);
      },
      onArrowRight: (event) => {
        event.preventDefault();
        changeActiveIndex(1);
      },
      onBackspace: (event) => {
        event.preventDefault();
        changeActiveIndex(-1);
      },
      onKeyDown: (event) => {
        if (isCtrl(event) && config.isTwoCharacterTilePrefix(event.key)) {
          changeActiveIndex(1);
        } else if (event.currentTarget.value === event.key) {
          event.preventDefault();
          event.stopPropagation();
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
          onChange={handleChange}
          onKeyDown={handleKeyDown}
        />
      ))}
    </div>
  );
};

export default Rack;
