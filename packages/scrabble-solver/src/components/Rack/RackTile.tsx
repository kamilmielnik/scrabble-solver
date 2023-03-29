import { BLANK } from '@scrabble-solver/constants';
import { Tile as TileModel } from '@scrabble-solver/types';
import classNames from 'classnames';
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
import {
  rackSlice,
  selectCharacterIsValid,
  selectCharacterPoints,
  selectConfig,
  selectLocale,
  useTranslate,
  useTypedSelector,
} from 'state';

import Tile from '../Tile';

import styles from './Rack.module.scss';

interface Props {
  activeIndexRef: MutableRefObject<number | undefined>;
  character: string | null;
  className?: string;
  index: number;
  inputRef: RefObject<HTMLInputElement>;
  size: number;
  tile: TileModel | null;
  onChange: ChangeEventHandler<HTMLInputElement>;
  onKeyDown: KeyboardEventHandler<HTMLInputElement>;
}

const RackTile: FunctionComponent<Props> = ({
  activeIndexRef,
  character,
  className,
  index,
  inputRef,
  size,
  tile,
  onChange,
  onKeyDown,
}) => {
  const dispatch = useDispatch();
  const translate = useTranslate();
  const locale = useTypedSelector(selectLocale);
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
      aria-label={translate('rack.tile.location', {
        index: (index + 1).toLocaleString(locale),
      })}
      autoFocus={index === 0}
      className={classNames(styles.tile, className)}
      character={character === null ? undefined : character}
      highlighted={tile !== null}
      inputRef={inputRef}
      isBlank={character === BLANK}
      isValid={isValid}
      key={index}
      placeholder={translate('rack.placeholder')[index]}
      points={points}
      raised
      size={size}
      tabIndex={index === 0 ? undefined : -1}
      onChange={handleChange}
      onFocus={handleFocus}
      onKeyDown={handleKeyDown}
    />
  );
};

export default RackTile;
