import { FunctionComponent } from 'react';

import { CardChecklist, Cog, Github, Sack } from 'icons';
import { GITHUB_PROJECT_URL } from 'parameters';
import { useTranslate } from 'state';

import Modal from '../Modal';

import styles from './Menu.module.scss';

interface Props {
  className?: string;
  isOpen: boolean;
  onClose: () => void;
  onShowRemainingTiles: () => void;
  onShowSettings: () => void;
  onShowWords: () => void;
}

const Menu: FunctionComponent<Props> = ({
  className,
  isOpen,
  onClose,
  onShowRemainingTiles,
  onShowSettings,
  onShowWords,
}) => {
  const translate = useTranslate();

  return (
    <Modal className={className} isOpen={isOpen} title={translate('menu')} onClose={onClose}>
      <button className={styles.button} onClick={onShowRemainingTiles}>
        <Sack className={styles.icon} />
        <div className={styles.content}>{translate('remaining-tiles')}</div>
      </button>

      <button className={styles.button} onClick={onShowWords}>
        <CardChecklist className={styles.icon} />
        <div className={styles.content}>{translate('words')}</div>
      </button>

      <a className={styles.button} href={GITHUB_PROJECT_URL} rel="noopener noreferrer" target="_blank">
        <Github className={styles.icon} />
        <div className={styles.content}>{translate('github')}</div>
      </a>

      <button className={styles.button} onClick={onShowSettings}>
        <Cog className={styles.icon} />
        <div className={styles.content}>{translate('settings')}</div>
      </button>
    </Modal>
  );
};

export default Menu;
