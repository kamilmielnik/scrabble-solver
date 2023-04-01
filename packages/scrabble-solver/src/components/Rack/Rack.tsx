/* eslint-disable max-lines, max-statements */

import { FloatingPortal, autoUpdate, useFloating } from '@floating-ui/react';
import classNames from 'classnames';
import {
  ChangeEvent,
  ClipboardEvent,
  FunctionComponent,
  createRef,
  useCallback,
  useMemo,
  useRef,
  useState,
} from 'react';
import useOnclickOutside from 'react-cool-onclickoutside';
import { useDispatch } from 'react-redux';

import { useAppLayout } from 'hooks';
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
import {
  rackSlice,
  selectConfig,
  selectInputMode,
  selectLocale,
  selectRack,
  selectResultCandidateTiles,
  useTypedSelector,
} from 'state';

import { InputPrompt, RackTile } from './components';
import styles from './Rack.module.scss';

interface Props {
  className?: string;
  tileSize: number;
}

const Rack: FunctionComponent<Props> = ({ className, tileSize }) => {
  const dispatch = useDispatch();
  const config = useTypedSelector(selectConfig);
  const locale = useTypedSelector(selectLocale);
  const rack = useTypedSelector(selectRack);
  const inputMode = useTypedSelector(selectInputMode);
  const { rackHeight } = useAppLayout();
  const resultCandidateTiles = useTypedSelector(selectResultCandidateTiles);
  const tiles = useMemo(() => zipCharactersAndTiles(rack, resultCandidateTiles), [rack, resultCandidateTiles]);
  const tilesCount = tiles.length;
  const tilesRefs = useMemo(() => createArray(tilesCount).map(() => createRef<HTMLInputElement>()), [tilesCount]);
  const activeIndexRef = useRef<number>();
  const [hasFocus, setHasFocus] = useState(false);
  const [input, setInput] = useState('');
  const { direction } = LOCALE_FEATURES[locale];
  const { tileFontSize } = getTileSizes(tileSize);
  const showInputPrompt = inputMode === 'touchscreen' && hasFocus;
  const ref = useRef<HTMLDivElement>(null);

  useOnclickOutside(() => setHasFocus(false), {
    ignoreClass: [InputPrompt.styles.form, InputPrompt.styles.input],
    refs: [ref],
  });

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

  const handleFocus = useCallback(() => {
    setHasFocus(true);
    floatingInputPrompt.refs.setPositionReference(ref.current);
    const characters: string[] = rack.filter((character) => character !== null) as string[];
    const uppercasedDigraphs = characters.map((character) => {
      return character.length > 1 ? character.toLocaleUpperCase(locale) : character;
    });
    setInput(uppercasedDigraphs.join(''));
  }, [rack, ref]);

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

  const floatingInputPrompt = useFloating({
    placement: 'bottom-start',
    whileElementsMounted: autoUpdate,
  });

  return (
    <>
      <div
        className={classNames(styles.rack, className, {
          [styles.hidden]: showInputPrompt,
        })}
        ref={ref}
        style={{ fontSize: tileFontSize }}
        onPaste={handlePaste}
      >
        {tiles.map(({ character, tile }, index) => (
          <RackTile
            activeIndexRef={activeIndexRef}
            character={character}
            className={classNames(styles.tile, {
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
            onFocus={handleFocus}
          />
        ))}
      </div>

      {showInputPrompt && (
        <FloatingPortal>
          <InputPrompt
            ref={floatingInputPrompt.refs.setFloating}
            style={{
              position: floatingInputPrompt.strategy,
              top: floatingInputPrompt.y ? floatingInputPrompt.y - rackHeight : 0,
              left: floatingInputPrompt.x ?? 0,
            }}
            tileSize={tileSize}
            value={input}
            onBlur={() => setHasFocus(false)}
            onChange={(event) => setInput(event.target.value)}
            onSubmit={() => setHasFocus(false)}
          />
        </FloatingPortal>
      )}
    </>
  );
};

export default Rack;
