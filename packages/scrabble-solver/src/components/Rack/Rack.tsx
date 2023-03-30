import classNames from 'classnames';
import { ChangeEvent, ClipboardEvent, createRef, FunctionComponent, useCallback, useMemo, useRef } from 'react';
import { useDispatch } from 'react-redux';

import { LOCALE_FEATURES } from 'i18n';
import {
  createArray,
  createKeyboardNavigation,
  extractCharacters,
  extractInputValue,
  getTileSizes,
  isCtrl,
  zipCharactersAndTiles,
} from 'lib';
import { rackSlice, selectConfig, selectLocale, selectRack, selectResultCandidateTiles, useTypedSelector } from 'state';

import styles from './Rack.module.scss';
import RackTile from './RackTile';

interface Props {
  className?: string;
  tileSize: number;
}

const Rack: FunctionComponent<Props> = ({ className, tileSize }) => {
  const dispatch = useDispatch();
  const config = useTypedSelector(selectConfig);
  const locale = useTypedSelector(selectLocale);
  const rack = useTypedSelector(selectRack);
  const resultCandidateTiles = useTypedSelector(selectResultCandidateTiles);
  const tiles = useMemo(() => zipCharactersAndTiles(rack, resultCandidateTiles), [rack, resultCandidateTiles]);
  const tilesCount = tiles.length;
  const tilesRefs = useMemo(() => createArray(tilesCount).map(() => createRef<HTMLInputElement>()), [tilesCount]);
  const activeIndexRef = useRef<number>();
  const { direction } = LOCALE_FEATURES[locale];
  const { tileFontSize } = getTileSizes(tileSize);

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
      changeActiveIndex(value ? characters.length : -1);
    },
    [changeActiveIndex, config],
  );

  const handlePaste = useCallback(
    (event: ClipboardEvent<HTMLInputElement>) => {
      const index = activeIndexRef.current;

      if (typeof index === 'undefined') {
        return;
      }

      event.preventDefault();
      const value = event.clipboardData.getData('text/plain').toLocaleLowerCase();
      const characters = value ? extractCharacters(config, value) : [];
      changeActiveIndex(value ? characters.length : -1);
      dispatch(rackSlice.actions.changeCharacters({ characters, index }));
    },
    [changeActiveIndex, config, dispatch],
  );

  const handleKeyDown = useMemo(() => {
    return createKeyboardNavigation({
      onArrowLeft: (event) => {
        event.preventDefault();
        changeActiveIndex(direction === 'ltr' ? -1 : 1);
      },
      onArrowRight: (event) => {
        event.preventDefault();
        changeActiveIndex(direction === 'ltr' ? 1 : -1);
      },
      onBackspace: (event) => {
        event.preventDefault();
        changeActiveIndex(-1);
      },
      onDelete: (event) => {
        const index = activeIndexRef.current;

        if (typeof index === 'undefined') {
          return;
        }

        event.preventDefault();
        dispatch(rackSlice.actions.changeCharacters({ characters: [null], index }));
        changeActiveIndex(1);
      },
      onKeyDown: (event) => {
        if (isCtrl(event) && config.isTwoCharacterTilePrefix(event.key)) {
          changeActiveIndex(1);
        } else if (event.currentTarget.value === event.key) {
          // change event did not fire because the same character was typed over the current one
          // but we still want to move the caret
          event.preventDefault();
          event.stopPropagation();
          changeActiveIndex(1);
        }
      },
    });
  }, [changeActiveIndex, config, direction]);

  return (
    <div className={classNames(styles.rack, className)} style={{ fontSize: tileFontSize }} onPaste={handlePaste}>
      {tiles.map(({ character, tile }, index) => (
        <RackTile
          activeIndexRef={activeIndexRef}
          character={character}
          className={classNames({
            [styles.sharpLeft]: index !== 0,
            [styles.sharpRight]: index !== tiles.length - 1,
          })}
          index={index}
          inputRef={tilesRefs[index]}
          key={index}
          size={tileSize}
          tile={tile}
          onChange={handleChange}
          onKeyDown={handleKeyDown}
        />
      ))}
    </div>
  );
};

export default Rack;
