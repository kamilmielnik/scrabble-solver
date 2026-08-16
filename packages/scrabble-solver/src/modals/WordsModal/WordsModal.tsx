import { type FunctionComponent, memo } from 'react';

import { Badge } from '@/components/Badge';
import { Modal } from '@/components/Modal';
import { selectInvalidWords, selectLocale, selectValidWords, useTranslate, useTypedSelector } from '@/state';

import { Word } from './components';
import styles from './WordsModal.module.scss';

interface Props {
  className?: string;
  isOpen: boolean;
  onClose: () => void;
}

const WordsModalBase: FunctionComponent<Props> = ({ className, isOpen, onClose }) => {
  const translate = useTranslate();
  const locale = useTypedSelector(selectLocale);
  const invalidWords = useTypedSelector(selectInvalidWords);
  const validWords = useTypedSelector(selectValidWords);

  return (
    <Modal className={className} isOpen={isOpen} title={translate('words')} onClose={onClose}>
      <Modal.Section
        label={translate('words.invalid')}
        title={
          <span className={styles.title}>
            <span>{translate('words.invalid')}</span>
            <Badge className={styles.badge}>{invalidWords.length.toLocaleString(locale)}</Badge>
          </span>
        }
      >
        {invalidWords.map((word) => (
          <Word isValid={false} key={`${word.x}-${word.y}-${word.direction}`} word={word} />
        ))}
      </Modal.Section>

      <Modal.Section
        label={translate('words.valid')}
        title={
          <span className={styles.title}>
            <span>{translate('words.valid')}</span>
            <Badge className={styles.badge}>{validWords.length.toLocaleString(locale)}</Badge>
          </span>
        }
      >
        {validWords.map((word) => (
          <Word isValid key={`${word.x}-${word.y}-${word.direction}`} word={word} />
        ))}
      </Modal.Section>
    </Modal>
  );
};

export const WordsModal = memo(WordsModalBase);
