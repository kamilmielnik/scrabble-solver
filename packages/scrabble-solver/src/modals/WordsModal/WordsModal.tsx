import classNames from 'classnames';
import { FunctionComponent, memo } from 'react';

import { Badge, Modal } from 'components';
import { Check, Cross } from 'icons';
import { selectLocale, selectVerify, useTranslate, useTypedSelector } from 'state';

import styles from './WordsModal.module.scss';

interface Props {
  className?: string;
  isOpen: boolean;
  onClose: () => void;
}

const WordsModal: FunctionComponent<Props> = ({ className, isOpen, onClose }) => {
  const translate = useTranslate();
  const locale = useTypedSelector(selectLocale);
  const { invalidWords, validWords } = useTypedSelector(selectVerify);

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
        {invalidWords.map((word, index) => (
          <div className={styles.word} key={index}>
            <Cross aria-hidden="true" className={classNames(styles.icon, styles.invalid)} role="img" /> {word}
          </div>
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
        {validWords.map((word, index) => (
          <div className={styles.word} key={index}>
            <Check aria-hidden="true" className={classNames(styles.icon, styles.valid)} role="img" /> {word}
          </div>
        ))}
      </Modal.Section>
    </Modal>
  );
};

export default memo(WordsModal);
