import classNames from 'classnames';
import React, { AnimationEventHandler, FunctionComponent, ReactNode } from 'react';

import { Cross } from 'icons';
import { useTranslate } from 'state';

import Button from '../Button';

import styles from './Screen.module.scss';

interface Props {
  children?: ReactNode;
  className?: string;
  contentClassName?: string;
  onAnimationEnd?: AnimationEventHandler<HTMLDivElement>;
  onClose?: () => void;
}

const Screen: FunctionComponent<Props> = ({ children, className, contentClassName, onAnimationEnd, onClose }) => {
  const translate = useTranslate();

  return (
    <div className={classNames(styles.screen, className)} onAnimationEnd={onAnimationEnd}>
      {onClose && (
        <Button className={styles.closeButton} Icon={Cross} title={translate('common.close')} onClick={onClose}>
          {translate('common.close')}
        </Button>
      )}

      <div className={classNames(styles.content, contentClassName)}>{children}</div>
    </div>
  );
};

export default Screen;
