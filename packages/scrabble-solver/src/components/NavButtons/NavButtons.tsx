import React, { FunctionComponent } from 'react';

import { cog, eraser, github, keyboard } from 'icons';
import { useTranslate } from 'state';

import Button from '../Button';

import styles from './NavButtons.module.scss';

const GITHUB_PROJECT_URL = 'https://github.com/kamilmielnik/scrabble-solver';

interface Props {
  onClear: () => void;
  onShowKeyMap: () => void;
  onShowSettings: () => void;
}

const NavButtons: FunctionComponent<Props> = ({ onClear, onShowKeyMap, onShowSettings }) => {
  const translate = useTranslate();

  return (
    <div className={styles.navButtons}>
      <Button.Link
        className={styles.button}
        href={GITHUB_PROJECT_URL}
        icon={github}
        rel="noopener noreferrer"
        target="_blank"
        title={translate('github')}
      >
        GitHub
      </Button.Link>

      <Button className={styles.button} icon={keyboard} title={translate('keyMap')} onClick={onShowKeyMap}>
        {translate('keyMap')}
      </Button>

      <div className={styles.separator} />

      <Button className={styles.button} icon={eraser} title={translate('clear')} onClick={onClear}>
        {translate('clear')}
      </Button>

      <Button className={styles.button} icon={cog} title={translate('settings')} onClick={onShowSettings}>
        {translate('settings')}
      </Button>
    </div>
  );
};

export default NavButtons;
