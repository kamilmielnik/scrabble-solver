import classNames from 'classnames';
import { FunctionComponent, ReactNode, useEffect, useState } from 'react';
import ReactModal from 'react-modal';
import { useKey } from 'react-use';

import { CrossSquareFill } from 'icons';
import { TRANSITION_DURATION_LONG } from 'parameters';
import { useTranslate } from 'state';

import SquareButton from '../SquareButton';

import { Section } from './components';
import styles from './Modal.module.scss';

export interface Props {
  children: ReactNode;
  className?: string;
  isOpen: boolean;
  title: string;
  onClose: () => void;
}

const Modal: FunctionComponent<Props> = ({ children, className, isOpen, title, onClose }) => {
  const translate = useTranslate();
  const [shouldReturnFocusAfterClose, setShouldReturnFocusAfterClose] = useState(true);

  useKey(
    'Escape',
    () => {
      setShouldReturnFocusAfterClose(false);
      onClose();
    },
    undefined,
    [onClose],
  );

  useEffect(() => {
    if (isOpen) {
      setShouldReturnFocusAfterClose(true);
    }
  }, [isOpen]);

  return (
    <ReactModal
      className={{
        afterOpen: styles.afterOpen,
        base: styles.modal,
        beforeClose: styles.beforeClose,
      }}
      closeTimeoutMS={TRANSITION_DURATION_LONG}
      contentLabel={title}
      isOpen={isOpen}
      overlayClassName={styles.overlay}
      shouldReturnFocusAfterClose={shouldReturnFocusAfterClose}
      onRequestClose={onClose}
    >
      <div className={classNames(styles.container, className)}>
        <div className={styles.header}>
          <h1 className={styles.title}>{title}</h1>

          <SquareButton
            aria-label={translate('common.close')}
            className={styles.closeButton}
            Icon={CrossSquareFill}
            tooltip={translate('common.close')}
            onClick={onClose}
          />
        </div>

        <div className={styles.content}>{children}</div>
      </div>
    </ReactModal>
  );
};

export default Object.assign(Modal, {
  Section,
});
