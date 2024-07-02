import classNames from 'classnames';
import { ButtonHTMLAttributes, FunctionComponent } from 'react';

import { useIsTouchDevice } from 'hooks';
import { ArrowDown } from 'icons';
import { useTranslate } from 'state';
import { Direction } from 'types';

import Button from '../../../Button';

import styles from './ToggleDirectionButton.module.scss';

interface Props extends ButtonHTMLAttributes<HTMLButtonElement> {
  className?: string;
  direction: Direction;
}

const ToggleDirectionButton: FunctionComponent<Props> = ({ className, direction, ...props }) => {
  const translate = useTranslate();
  const isTouchDevice = useIsTouchDevice();

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
          <span>{translate('cell.toggle-direction')}</span>
          {!isTouchDevice && <span> ({translate('common.arrows')})</span>}
        </>
      }
      {...props}
    />
  );
};

export default ToggleDirectionButton;
