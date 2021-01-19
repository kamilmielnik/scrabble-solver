import classNames from 'classnames';
import React, { FunctionComponent, ReactNode } from 'react';

import { cross } from 'icons';
import { useTranslate } from 'state';

import Button from '../Button';

import styles from './Screen.module.scss';

interface Props {
  children?: ReactNode;
  className?: string;
  contentClassName?: string;
  onClose?: () => void;
}

const Screen: FunctionComponent<Props> = ({ children, className, contentClassName, onClose }) => {
  const translate = useTranslate();

  return (
    <div className={classNames(styles.screen, className)}>
      {onClose && (
        <Button className={styles.closeButton} icon={cross} title={translate('close')} onClick={onClose}>
          {translate('close')}
        </Button>
      )}

      <div className={classNames(styles.content, contentClassName)}>{children}</div>
    </div>
  );
};

export default Screen;
