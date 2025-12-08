import classNames from 'classnames';
import { type FunctionComponent, type ReactNode, useCallback, useEffect, useState } from 'react';
import ReactModal from 'react-modal';

import { CrossSquareFill } from 'icons';
import { TRANSITION_DURATION_LONG } from 'parameters';
import { useTranslate } from 'state';

import { IconButton } from '../IconButton';

import { Section } from './components';
import styles from './Modal.module.scss';

export interface Props {
  children: ReactNode;
  className?: string;
  footer?: ReactNode;
  isOpen: boolean;
  title: string;
  onClose: () => void;
}

const ModalBase: FunctionComponent<Props> = ({ children, className, footer, isOpen, title, onClose }) => {
  const translate = useTranslate();
  const [shouldReturnFocusAfterClose, setShouldReturnFocusAfterClose] = useState(true);

  const handleEscape = useCallback(
    (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setShouldReturnFocusAfterClose(false);
        setTimeout(() => {
          onClose();
        }, 0);
      }
    },
    [onClose],
  );

  useEffect(() => {
    document.addEventListener('keydown', handleEscape);

    return () => {
      document.removeEventListener('keydown', handleEscape);
    };
  }, [handleEscape]);

  useEffect(() => {
    if (isOpen) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
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

          <IconButton
            aria-label={translate('common.close')}
            className={styles.closeButton}
            Icon={CrossSquareFill}
            tooltip={translate('common.close')}
            onClick={onClose}
          />
        </div>

        <div className={styles.content}>{children}</div>

        {footer && <div className={styles.footer}>{footer}</div>}
      </div>
    </ReactModal>
  );
};

export const Modal = Object.assign(ModalBase, {
  Section,
});
