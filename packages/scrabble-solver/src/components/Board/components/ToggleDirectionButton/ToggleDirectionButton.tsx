import classNames from 'classnames';
import { ButtonHTMLAttributes, FunctionComponent } from 'react';

import { ArrowDown } from 'icons';
import { useTranslate } from 'state';
import { Direction } from 'types';

import Button from '../../../Button';
import { Arrows } from '../../../keys';

import styles from './ToggleDirectionButton.module.scss';

interface Props extends ButtonHTMLAttributes<HTMLButtonElement> {
  className?: string;
  direction: Direction;
}

const ToggleDirectionButton: FunctionComponent<Props> = ({ className, direction, ...props }) => {
  const translate = useTranslate();

  return (
    <Button
      aria-label={translate('cell.toggle-direction')}
      className={classNames(styles.button, className)}
      Icon={ArrowDown}
      iconClassName={classNames(styles.icon, {
        [styles.right]: direction === 'horizontal',
      })}
      tooltip={
        <>
          {translate('cell.toggle-direction')}
          <Arrows className={styles.arrows} size="small" />
        </>
      }
      {...props}
    />
  );
};

export default ToggleDirectionButton;
