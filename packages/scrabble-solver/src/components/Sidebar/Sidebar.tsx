import classNames from 'classnames';
import React, { FunctionComponent, ReactNode } from 'react';

import { cross } from 'icons';
import { useTranslation } from 'state';

import IconButton from '../IconButton';

import styles from './Sidebar.module.scss';

interface Props {
  children: ReactNode;
  className?: string;
  hidden: boolean;
  title: string;
  onClose: () => void;
}

const Sidebar: FunctionComponent<Props> = ({ children, className, hidden, title, onClose }) => {
  const closeTranslation = useTranslation('close');

  return (
    <div
      aria-hidden={hidden}
      className={classNames(styles.sidebar, className, {
        [styles.hidden]: hidden,
      })}
    >
      <div className={styles.header}>
        <h1 className={styles.title}>{title}</h1>

        <IconButton
          className={styles.closeButton}
          disabled={hidden}
          icon={cross}
          title={closeTranslation}
          onClick={onClose}
        />
      </div>

      <div className={styles.content}>{children}</div>
    </div>
  );
};

export default Sidebar;
