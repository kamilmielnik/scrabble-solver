import { type FunctionComponent, memo } from 'react';

import { Modal } from '@/components/Modal';
import { useTranslate } from '@/state';

import { WordsTable } from './components';
import styles from './WordsModal.module.scss';

interface Props {
  className?: string;
  isOpen: boolean;
  onClose: () => void;
}

const WordsModalBase: FunctionComponent<Props> = ({ className, isOpen, onClose }) => {
  const translate = useTranslate();

  return (
    <Modal className={className} isOpen={isOpen} title={translate('words')} onClose={onClose}>
      <div className={styles.content}>
        <WordsTable className={styles.words} />
      </div>
    </Modal>
  );
};

export const WordsModal = memo(WordsModalBase);
