import React, { FunctionComponent } from 'react';

import { cog, eraser, github, keyboard } from 'icons';
import { GITHUB_PROJECT_URL } from 'parameters';
import { useTranslate } from 'state';

import SquareButton from '../SquareButton';

import styles from './NavButtons.module.scss';

interface Props {
  onClear: () => void;
  onShowKeyMap: () => void;
  onShowSettings: () => void;
}

const NavButtons: FunctionComponent<Props> = ({ onClear, onShowKeyMap, onShowSettings }) => {
  const translate = useTranslate();

  return (
    <div className={styles.navButtons}>
      <SquareButton.Link
        className={styles.button}
        href={GITHUB_PROJECT_URL}
        icon={github}
        rel="noopener noreferrer"
        target="_blank"
        title={translate('github')}
      >
        GitHub
      </SquareButton.Link>

      <SquareButton className={styles.button} icon={keyboard} title={translate('keyMap')} onClick={onShowKeyMap}>
        {translate('keyMap')}
      </SquareButton>

      <div className={styles.separator} />

      <SquareButton className={styles.button} icon={eraser} title={translate('clear')} onClick={onClear}>
        {translate('clear')}
      </SquareButton>

      <SquareButton className={styles.button} icon={cog} title={translate('settings')} onClick={onShowSettings}>
        {translate('settings')}
      </SquareButton>
    </div>
  );
};

export default NavButtons;
