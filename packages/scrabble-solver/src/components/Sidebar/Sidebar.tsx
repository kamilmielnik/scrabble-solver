import classNames from 'classnames';
import React, { FunctionComponent, ReactNode } from 'react';
import Modal from 'react-modal';

import { Cross } from 'icons';
import { TRANSITION_DURATION_LONG } from 'parameters';
import { useTranslate } from 'state';

import SquareButton from '../SquareButton';

import { Section } from './components';
import styles from './Sidebar.module.scss';

export interface Props {
  children: ReactNode;
  className?: string;
  isOpen: boolean;
  title: string;
  onClose: () => void;
}

const Sidebar: FunctionComponent<Props> = ({ children, className, isOpen, title, onClose }) => {
  const translate = useTranslate();

  return (
    <Modal
      className={{
        afterOpen: styles.afterOpen,
        base: styles.modal,
        beforeClose: styles.beforeClose,
      }}
      closeTimeoutMS={TRANSITION_DURATION_LONG}
      contentLabel={title}
      isOpen={isOpen}
      overlayClassName={styles.overlay}
      onRequestClose={onClose}
    >
      <div className={classNames(styles.sidebar, className)}>
        <div className={styles.header}>
          <h1 className={styles.title}>{title}</h1>

          <SquareButton className={styles.closeButton} Icon={Cross} title={translate('common.close')} onClick={onClose}>
            {translate('common.close')}
          </SquareButton>
        </div>

        <div className={styles.content}>{children}</div>
      </div>
    </Modal>
  );
};

export default Object.assign(Sidebar, {
  Section,
});
