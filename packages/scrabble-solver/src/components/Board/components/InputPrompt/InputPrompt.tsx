import classNames from 'classnames';
import { FormEventHandler, forwardRef, HTMLProps, MouseEventHandler, useEffect, useState } from 'react';

import { Check } from 'icons';
import { useTranslate } from 'state';
import { Direction } from 'types';

import Button from '../../../Button';
import ToggleDirectionButton from '../ToggleDirectionButton';

import styles from './InputPrompt.module.scss';

interface Props extends Omit<HTMLProps<HTMLFormElement>, 'onSubmit'> {
  className?: string;
  direction: Direction;
  initialValue: string;
  onDirectionToggle: MouseEventHandler<HTMLButtonElement>;
  onSubmit: (input: string) => void;
}

const InputPrompt = forwardRef<HTMLFormElement, Props>(
  ({ className, direction, disabled, initialValue, onDirectionToggle, onSubmit, ...props }, ref) => {
    const translate = useTranslate();
    const [inputRef, setInputRef] = useState<HTMLInputElement | null>(null);
    const [input, setInput] = useState(initialValue.trim());

    // On iOS it helps with losing focus too early which makes Actions disappear
    const handleMouseDown: MouseEventHandler = (event) => event.preventDefault();

    const handleSubmit: FormEventHandler<HTMLFormElement> = (event) => {
      event.preventDefault();
      event.stopPropagation();
      onSubmit(input);
    };

    useEffect(() => {
      if (inputRef) {
        inputRef.focus();
        inputRef.select();
      }
    }, [inputRef]);

    return (
      <form className={classNames(styles.inputPrompt, className)} ref={ref} onSubmit={handleSubmit} {...props}>
        <ToggleDirectionButton
          className={styles.toggleDirection}
          direction={direction}
          tabIndex={disabled ? -1 : undefined}
          onClick={onDirectionToggle}
          onMouseDown={handleMouseDown}
        />

        <div>
          <input
            className={styles.input}
            placeholder={translate('rack.placeholder')}
            ref={setInputRef}
            tabIndex={disabled ? -1 : undefined}
            value={input}
            onChange={(event) => setInput(event.target.value)}
          />
        </div>

        <Button
          aria-label={translate('results.insert')}
          className={styles.insert}
          Icon={Check}
          iconClassName={styles.insertIcon}
          tabIndex={disabled ? -1 : undefined}
          tooltip={translate('results.insert')}
          type="submit"
          variant="primary"
          onMouseDown={handleMouseDown}
        />
      </form>
    );
  },
);

export default InputPrompt;
