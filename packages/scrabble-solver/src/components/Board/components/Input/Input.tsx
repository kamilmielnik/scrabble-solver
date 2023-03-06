import { useMergeRefs } from '@floating-ui/react';
import classNames from 'classnames';
import { ChangeEventHandler, FocusEventHandler, forwardRef, HTMLProps, useEffect, useRef, useState } from 'react';
import { useLatest } from 'react-use';

import { noop } from 'lib';
import { selectLocale, selectRowsWithCandidate, useTranslate, useTypedSelector } from 'state';
import { Point } from 'types';

import styles from './Input.module.scss';

interface Props extends HTMLProps<HTMLInputElement> {
  activePosition: Point;
  focusPosition: Point;
}

const Input = forwardRef<HTMLInputElement, Props>(
  ({ activePosition, autoFocus, className, focusPosition, onChange = noop, onFocus = noop, ...props }, ref) => {
    const translate = useTranslate();
    const locale = useTypedSelector(selectLocale);
    const rows = useTypedSelector(selectRowsWithCandidate);
    const cell = rows[activePosition.y][activePosition.x];
    const inputRef = useRef<HTMLInputElement>(null);
    const mergedRef = useMergeRefs(ref ? [inputRef, ref] : [inputRef]);
    const [value, setValue] = useState(cell.tile.character);
    const characterRef = useLatest(cell.tile.character);

    const handleChange: ChangeEventHandler<HTMLInputElement> = (event) => {
      setValue(event.target.value);
      onChange(event);
    };

    const handleFocus: FocusEventHandler<HTMLInputElement> = (event) => {
      setValue(cell.tile.character);
      onFocus(event);
    };

    useEffect(() => {
      setValue(characterRef.current);
    }, [focusPosition]);

    return (
      <input
        aria-label={translate('cell.tile.location', {
          character: cell.tile.character,
          x: (activePosition.x + 1).toLocaleString(locale),
          y: (activePosition.y + 1).toLocaleString(locale),
        })}
        autoCapitalize="none"
        autoComplete="off"
        autoCorrect="off"
        autoFocus={autoFocus}
        className={classNames(styles.input, className)}
        ref={mergedRef}
        spellCheck={false}
        value={value}
        onChange={handleChange}
        onFocus={handleFocus}
        {...props}
      />
    );
  },
);

export default Input;
