import { useMergeRefs } from '@floating-ui/react';
import classNames from 'classnames';
import { forwardRef, HTMLProps, KeyboardEventHandler, useEffect, useRef } from 'react';

import { noop } from 'lib';
import { selectLocale, selectRowsWithCandidate, useTranslate, useTypedSelector } from 'state';

import { Point } from '../../types';

import styles from './Input.module.scss';

interface Props extends HTMLProps<HTMLInputElement> {
  activePosition: Point;
}

const Input = forwardRef<HTMLInputElement, Props>(
  ({ activePosition, autoFocus, className, onKeyDown = noop, ...props }, ref) => {
    const translate = useTranslate();
    const locale = useTypedSelector(selectLocale);
    const rows = useTypedSelector(selectRowsWithCandidate);
    const cell = rows[activePosition.y][activePosition.x];
    const inputRef = useRef<HTMLInputElement>(null);
    const mergedRef = useMergeRefs(ref ? [inputRef, ref] : [inputRef]);

    const handleKeyDown: KeyboardEventHandler<HTMLInputElement> = (event) => {
      inputRef.current?.select();
      onKeyDown(event);
    };

    useEffect(() => {
      if (autoFocus && inputRef.current) {
        inputRef.current.focus();
      }
    }, [autoFocus, inputRef]);

    return (
      <input
        aria-label={translate('cell.tile.location', {
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
        value={cell.tile.character || ''}
        onKeyDown={handleKeyDown}
        {...props}
      />
    );
  },
);

export default Input;
