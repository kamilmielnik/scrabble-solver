import { type FunctionComponent, memo, useCallback, useEffect, useRef } from 'react';
import { useDispatch } from 'react-redux';

import { Button } from '@/components/Button';
import { Dictionary } from '@/components/Dictionary';
import { Modal } from '@/components/Modal';
import { useIsTouchDevice } from '@/hooks/useIsTouchDevice';
import EyeFill from '@/icons/EyeFill.svg';
import { hoveredWordSlice, selectHoveredWord, useTranslate, useTypedSelector } from '@/state';

import { WordsTable } from './components';
import styles from './WordsModal.module.scss';

interface Props {
  className?: string;
  isOpen: boolean;
  onClose: () => void;
  onPreview: () => void;
}

const WordsModalBase: FunctionComponent<Props> = ({ className, isOpen, onClose, onPreview }) => {
  const dispatch = useDispatch();
  const translate = useTranslate();
  const hoveredWord = useTypedSelector(selectHoveredWord);
  const canPreview = useIsTouchDevice();
  const keepsHighlightOnClose = useRef(false);

  const handlePreview = useCallback(() => {
    keepsHighlightOnClose.current = true;
    onPreview();
  }, [onPreview]);

  useEffect(() => {
    if (!isOpen) {
      return;
    }

    return () => {
      if (!keepsHighlightOnClose.current) {
        dispatch(hoveredWordSlice.actions.clear());
      }

      keepsHighlightOnClose.current = false;
    };
  }, [dispatch, isOpen]);

  return (
    <Modal
      className={className}
      footer={
        canPreview && (
          <Button
            aria-label={translate('words.preview')}
            disabled={!hoveredWord}
            Icon={EyeFill}
            tooltip={translate('words.preview')}
            onClick={handlePreview}
          >
            {translate('words.preview')}
          </Button>
        )
      }
      isOpen={isOpen}
      title={translate('words')}
      onClose={onClose}
    >
      <div className={styles.content}>
        <WordsTable canPreview={canPreview} className={styles.words} isOpen={isOpen} onPreview={handlePreview} />
        <Dictionary className={styles.dictionary} />
      </div>
    </Modal>
  );
};

export const WordsModal = memo(WordsModalBase);
