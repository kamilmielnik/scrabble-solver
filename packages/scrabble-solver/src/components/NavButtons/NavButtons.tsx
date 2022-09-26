import classNames from 'classnames';
import { FunctionComponent } from 'react';

import { Cog, Eraser, Github, Keyboard, Sack } from 'icons';
import { GITHUB_PROJECT_URL } from 'parameters';
import { selectHasOverusedTiles, useTranslate, useTypedSelector } from 'state';

import SquareButton from '../SquareButton';

import styles from './NavButtons.module.scss';

interface Props {
  onClear: () => void;
  onShowKeyMap: () => void;
  onShowRemainingTiles: () => void;
  onShowSettings: () => void;
}

const NavButtons: FunctionComponent<Props> = ({ onClear, onShowKeyMap, onShowRemainingTiles, onShowSettings }) => {
  const translate = useTranslate();
  const hasOverusedTiles = useTypedSelector(selectHasOverusedTiles);

  return (
    <div className={styles.navButtons}>
      <SquareButton.Link
        className={styles.button}
        href={GITHUB_PROJECT_URL}
        Icon={Github}
        rel="noopener noreferrer"
        target="_blank"
        tooltip={translate('github')}
      />

      <div className={styles.separator} />

      <SquareButton className={styles.button} Icon={Keyboard} tooltip={translate('keyMap')} onClick={onShowKeyMap} />

      <SquareButton
        className={classNames(styles.button, {
          [styles.error]: hasOverusedTiles,
        })}
        Icon={Sack}
        tooltip={translate('remaining-tiles')}
        onClick={onShowRemainingTiles}
      />

      <div className={styles.separator} />

      <SquareButton className={styles.button} Icon={Eraser} tooltip={translate('common.clear')} onClick={onClear} />

      <SquareButton className={styles.button} Icon={Cog} tooltip={translate('settings')} onClick={onShowSettings} />
    </div>
  );
};

export default NavButtons;
