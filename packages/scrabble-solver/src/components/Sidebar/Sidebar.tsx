import classNames from 'classnames';
import React, { FunctionComponent, ReactNode } from 'react';

import { cross } from 'icons';
import { useTranslate } from 'state';

import SquareButton from '../SquareButton';

import { Section } from './components';
import styles from './Sidebar.module.scss';

export interface Props {
  children: ReactNode;
  className?: string;
  hidden: boolean;
  title: string;
  onClose: () => void;
}

const Sidebar: FunctionComponent<Props> = ({ children, className, hidden, title, onClose }) => {
  const translate = useTranslate();

  return (
    <div
      aria-hidden={hidden}
      className={classNames(styles.sidebar, className, {
        [styles.hidden]: hidden,
      })}
    >
      <div className={styles.header}>
        <h1 className={styles.title}>{title}</h1>

        <SquareButton
          className={styles.closeButton}
          disabled={hidden}
          icon={cross}
          title={translate('close')}
          onClick={onClose}
        >
          {translate('close')}
        </SquareButton>
      </div>

      <div className={styles.content}>{children}</div>
    </div>
  );
};

export default Object.assign(Sidebar, {
  Section,
});
