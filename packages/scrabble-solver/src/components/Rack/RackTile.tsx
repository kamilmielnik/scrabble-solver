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
} from 'react';
import { useDispatch } from 'react-redux';

import { createKeyboardNavigation, extractCharacters, extractInputValue, isCtrl } from 'lib';
import { TILE_SIZE } from 'parameters';
import {
  rackSlice,
  selectCharacterIsValid,
  selectCharacterPoints,
  selectConfig,
  useTranslate,
  useTypedSelector,
} from 'state';

import Tile from '../Tile';

import styles from './Rack.module.scss';

interface Props {
  activeIndexRef: MutableRefObject<number | undefined>;
  character: string | null;
  index: number;
  inputRef: RefObject<HTMLInputElement>;
  tile: TileModel | null;
  onChange: ChangeEventHandler<HTMLInputElement>;
  onKeyDown: KeyboardEventHandler<HTMLInputElement>;
}

const RackTile: FunctionComponent<Props> = ({
  activeIndexRef,
  character,
  index,
  inputRef,
  tile,
  onChange,
  onKeyDown,
}) => {
  const dispatch = useDispatch();
  const translate = useTranslate();
  const config = useTypedSelector(selectConfig);
  const points = useTypedSelector((state) => selectCharacterPoints(state, character));
  const isValid = useTypedSelector((state) => selectCharacterIsValid(state, character));

  const handleFocus = useCallback(() => {
    activeIndexRef.current = index;
  }, [index]);

  const handleChange = useCallback(
    (event: ChangeEvent<HTMLInputElement>) => {
      event.preventDefault();
      event.stopPropagation();
      const value = extractInputValue(event.target);
      const characters = value ? extractCharacters(config, value) : [null];
      dispatch(rackSlice.actions.changeCharacters({ characters, index }));
      onChange(event);
    },
    [config, index, onChange],
  );

  const handleKeyDown = useMemo(() => {
    return createKeyboardNavigation({
      onBackspace: (event) => {
        event.preventDefault();
        dispatch(rackSlice.actions.changeCharacter({ character: null, index }));
      },
      onKeyDown: (event) => {
        if (isCtrl(event) && config.isTwoCharacterTilePrefix(event.key)) {
          event.preventDefault();
          event.stopPropagation();
          const twoTilesCharacter = config.getTwoCharacterTileByPrefix(event.key);
          // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
          dispatch(rackSlice.actions.changeCharacter({ character: twoTilesCharacter!, index }));
        }

        onKeyDown(event);
      },
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
      isValid={isValid}
      key={index}
      placeholder={translate('rack.placeholder')[index]}
      points={points}
      raised
      size={TILE_SIZE}
      tabIndex={index === 0 ? undefined : -1}
      onChange={handleChange}
      onFocus={handleFocus}
      onKeyDown={handleKeyDown}
    />
  );
};

export default RackTile;
