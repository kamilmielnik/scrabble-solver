/* eslint-disable max-lines, max-statements */

import classNames from 'classnames';
import {
  CSSProperties,
  ChangeEventHandler,
  FormEventHandler,
  forwardRef,
  useCallback,
  useEffect,
  useState,
} from 'react';
import { useDispatch } from 'react-redux';

import { useAppLayout } from 'hooks';
import { extractCharactersByCase } from 'lib';
import { rackSlice, selectConfig, useTranslate, useTypedSelector } from 'state';

import styles from './InputPrompt.module.scss';

interface Props {
  className?: string;
  style?: CSSProperties;
  value: string;
  onBlur: () => void;
  onChange: ChangeEventHandler<HTMLInputElement>;
  onSubmit: FormEventHandler<HTMLFormElement>;
}

const InputPrompt = forwardRef<HTMLFormElement, Props>(
  ({ className, style, value, onBlur, onChange, onSubmit, ...props }, ref) => {
    const dispatch = useDispatch();
    const translate = useTranslate();
    const { rackHeight, rackWidth } = useAppLayout();
    const config = useTypedSelector(selectConfig);
    const [inputRef, setInputRef] = useState<HTMLInputElement | null>(null);

    const handleSubmit: FormEventHandler<HTMLFormElement> = useCallback(
      (event) => {
        event.preventDefault();
        const charactersByCase = extractCharactersByCase(config, value);
        const characters = Array.from({ length: config.rackSize }, (_, index) => {
          return typeof charactersByCase[index] === 'string' ? charactersByCase[index] : null;
        });
        dispatch(rackSlice.actions.changeCharacters({ characters, index: 0 }));
        onSubmit(event);
      },
      [config, value, onSubmit],
    );

    useEffect(() => {
      if (inputRef) {
        inputRef.focus();
        inputRef.select();
        inputRef.scrollIntoView({ block: 'end', inline: 'center' });
      }
    }, [inputRef]);

    return (
      <form
        className={classNames(styles.form, className)}
        ref={ref}
        style={{
          width: rackWidth,
          height: rackHeight,
          ...style,
        }}
        onSubmit={handleSubmit}
        {...props}
      >
        <input
          autoCapitalize="none"
          autoComplete="off"
          autoCorrect="off"
          className={styles.input}
          placeholder={translate('rack.touchscreen.placeholder')}
          ref={setInputRef}
          spellCheck={false}
          value={value}
          onBlur={onBlur}
          onChange={onChange}
        />
      </form>
    );
  },
);

export default Object.assign(InputPrompt, {
  styles,
});
