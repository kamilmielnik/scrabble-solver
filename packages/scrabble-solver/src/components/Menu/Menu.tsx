import { FunctionComponent } from 'react';

import { BookHalf, Cog, Github, Sack } from 'icons';
import { useTranslate } from 'state';

import Button from '../Button';
import Sidebar from '../Sidebar';

import styles from './Menu.module.scss';
import { GITHUB_PROJECT_URL } from 'parameters';

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
    <Sidebar className={className} isOpen={isOpen} title={translate('menu')} onClose={onClose}>
      <button className={styles.button} onClick={onShowRemainingTiles}>
        <Sack className={styles.icon} />
        <div className={styles.content}>{translate('remaining-tiles')}</div>
      </button>

      <button className={styles.button} onClick={onShowWords}>
        <BookHalf className={styles.icon} />
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
    </Sidebar>
  );
};

export default Menu;
