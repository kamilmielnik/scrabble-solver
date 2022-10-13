import { BLANK } from '@scrabble-solver/constants';
import { Tile as TileModel } from '@scrabble-solver/types';
import {
  ChangeEvent,
  ChangeEventHandler,
  FunctionComponent,
  KeyboardEventHandler,
  MutableRefObject,
  RefObject,
  useCallback,
  useMemo,
  useRef,
} from 'react';
import { useDispatch } from 'react-redux';

import { createKeyboardNavigation } from 'lib';
import { TILE_SIZE } from 'parameters';
import { rackSlice, selectCharacterPoints, selectConfig, useTranslate, useTypedSelector } from 'state';

import Tile from '../Tile';

import extractCharacters from './extractCharacters';
import styles from './Rack.module.scss';

interface Props {
  activeIndexRef: MutableRefObject<number | undefined>;
  character: string | null;
  index: number;
  inputRef: RefObject<HTMLInputElement>;
  tile: TileModel | null;
  onChange: ChangeEventHandler<HTMLInputElement>;
  onKeyDown: KeyboardEventHandler<HTMLInputElement>;
  onKeyUp: KeyboardEventHandler<HTMLInputElement>;
}

const RackTile: FunctionComponent<Props> = ({
  activeIndexRef,
  character,
  index,
  inputRef,
  tile,
  onChange,
  onKeyDown,
  onKeyUp,
}) => {
  const dispatch = useDispatch();
  const translate = useTranslate();
  const config = useTypedSelector(selectConfig);
  const points = useTypedSelector((state) => selectCharacterPoints(state, character));
  const isFocusedRef = useRef(false);

  const handleFocus = useCallback(() => {
    activeIndexRef.current = index;
    isFocusedRef.current = true;
  }, [index]);

  const handleChange = useCallback(
    (event: ChangeEvent<HTMLInputElement>) => {
      const value = event.target.value.toLocaleLowerCase();
      const characters = value ? extractCharacters(config, value) : [null];

      dispatch(rackSlice.actions.changeCharacters({ characters, index }));

      if (characters.length > 0) {
        onChange(event);
      } else {
        event.preventDefault();
        event.stopPropagation();
      }
    },
    [config, index, onChange],
  );

  const handleKeyDown = useMemo(() => {
    return createKeyboardNavigation({
      onBackspace: (event) => {
        event.preventDefault();
        dispatch(rackSlice.actions.changeCharacter({ character: null, index }));
      },
      onKeyDown,
    });
  }, [index, onKeyDown]);

  return (
    <Tile
      autoFocus={index === 0}
      className={styles.tile}
      character={character === null ? undefined : character}
      highlighted={tile !== null}
      inputRef={inputRef}
      isBlank={character === BLANK}
      key={index}
      placeholder={translate('rack.placeholder')[index]}
      points={points}
      raised
      size={TILE_SIZE}
      tabIndex={index === 0 ? undefined : -1}
      onChange={handleChange}
      onFocus={handleFocus}
      onKeyDown={handleKeyDown}
      onKeyUp={onKeyUp}
    />
  );
};

export default RackTile;
