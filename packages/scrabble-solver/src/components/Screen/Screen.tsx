import classNames from 'classnames';
import React, { FunctionComponent, ReactNode } from 'react';

import { cross } from 'icons';
import { useTranslation } from 'state';

import IconButton from '../IconButton';

import styles from './Screen.module.scss';

interface Props {
  children?: ReactNode;
  className?: string;
  hidden?: boolean;
  onClose?: () => void;
}

const Screen: FunctionComponent<Props> = ({ children, className, hidden, onClose }) => {
  const closeTranslation = useTranslation('close');

  return (
    <div
      className={classNames(styles.screen, className, {
        [styles.hidden]: hidden,
      })}
    >
      {onClose && <IconButton className={styles.closeButton} icon={cross} title={closeTranslation} onClick={onClose} />}

      <div className={styles.content}>{children}</div>
    </div>
  );
};

export default Screen;
