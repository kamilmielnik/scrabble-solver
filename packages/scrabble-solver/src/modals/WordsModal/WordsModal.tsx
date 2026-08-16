import { type FunctionComponent, memo } from 'react';

import { Button } from '@/components/Button';
import { Dictionary } from '@/components/Dictionary';
import { Modal } from '@/components/Modal';
import EyeFill from '@/icons/EyeFill.svg';
import { selectHoveredWord, useTranslate, useTypedSelector } from '@/state';

import { WordsTable } from './components';
import styles from './WordsModal.module.scss';

interface Props {
  className?: string;
  isOpen: boolean;
  onClose: () => void;
  onPreview: () => void;
}

const WordsModalBase: FunctionComponent<Props> = ({ className, isOpen, onClose, onPreview }) => {
  const translate = useTranslate();
  const hoveredWord = useTypedSelector(selectHoveredWord);

  return (
    <Modal
      className={className}
      footer={
        <Button
          aria-label={translate('words.preview')}
          disabled={!hoveredWord}
          Icon={EyeFill}
          tooltip={translate('words.preview')}
          onClick={onPreview}
        >
          {translate('words.preview')}
        </Button>
      }
      isOpen={isOpen}
      title={translate('words')}
      onClose={onClose}
    >
      <div className={styles.content}>
        <WordsTable className={styles.words} onPreview={onPreview} />
        <Dictionary className={styles.dictionary} />
      </div>
    </Modal>
  );
};

export const WordsModal = memo(WordsModalBase);
