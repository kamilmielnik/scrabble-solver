import classNames from 'classnames';
import { FunctionComponent } from 'react';

import { Check, Cross } from 'icons';
import { selectVerify, useTranslate, useTypedSelector } from 'state';

import Badge from '../Badge';
import Sidebar from '../Sidebar';

import styles from './Words.module.scss';

interface Props {
  className?: string;
  isOpen: boolean;
  onClose: () => void;
}

const Words: FunctionComponent<Props> = ({ className, isOpen, onClose }) => {
  const translate = useTranslate();
  const { invalidWords, validWords } = useTypedSelector(selectVerify);

  return (
    <Sidebar className={className} isOpen={isOpen} title={translate('words')} onClose={onClose}>
      <Sidebar.Section
        title={
          <span className={styles.title}>
            <span>{translate('words.invalid')}</span>
            <Badge className={styles.badge}>{invalidWords.length}</Badge>
          </span>
        }
      >
        {invalidWords.map((word, index) => (
          <div className={styles.word} key={index}>
            <Cross className={classNames(styles.icon, styles.invalid)} /> {word}
          </div>
        ))}
      </Sidebar.Section>

      <Sidebar.Section
        title={
          <span className={styles.title}>
            <span>{translate('words.valid')}</span>
            <Badge className={styles.badge}>{validWords.length}</Badge>
          </span>
        }
      >
        {validWords.map((word, index) => (
          <div className={styles.word} key={index}>
            <Check className={classNames(styles.icon, styles.valid)} /> {word}
          </div>
        ))}
      </Sidebar.Section>
    </Sidebar>
  );
};

export default Words;
