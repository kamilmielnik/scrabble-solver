import classNames from 'classnames';
import React, { FunctionComponent, ReactNode } from 'react';

import { cross } from 'icons';
import { useTranslation } from 'state';

import IconButton from '../IconButton';

import styles from './Screen.module.scss';

interface Props {
  children?: ReactNode;
  className?: string;
  contentClassName?: string;
  hidden?: boolean;
  onClose?: () => void;
}

const Screen: FunctionComponent<Props> = ({ children, className, contentClassName, hidden, onClose }) => {
  const closeTranslation = useTranslation('close');

  return (
    <div
      className={classNames(styles.screen, className, {
        [styles.hidden]: hidden,
      })}
    >
      {onClose && <IconButton className={styles.closeButton} icon={cross} title={closeTranslation} onClick={onClose} />}

      <div className={classNames(styles.content, contentClassName)}>{children}</div>
    </div>
  );
};

export default Screen;
