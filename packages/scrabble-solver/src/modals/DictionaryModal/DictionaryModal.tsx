import { type FunctionComponent, memo } from 'react';

import { Dictionary } from '@/components/Dictionary';
import { DictionaryInput } from '@/components/DictionaryInput';
import { Modal } from '@/components/Modal';
import { useTranslate } from '@/state';

import styles from './DictionaryModal.module.scss';

interface Props {
  className?: string;
  isOpen: boolean;
  onClose: () => void;
}

const DictionaryModalBase: FunctionComponent<Props> = ({ className, isOpen, onClose }) => {
  const translate = useTranslate();

  return (
    <Modal className={className} isOpen={isOpen} title={translate('dictionary')} onClose={onClose}>
      <div className={styles.content}>
        <Dictionary className={styles.dictionary} />
        <DictionaryInput className={styles.dictionaryInput} />
      </div>
    </Modal>
  );
};

export const DictionaryModal = memo(DictionaryModalBase);
