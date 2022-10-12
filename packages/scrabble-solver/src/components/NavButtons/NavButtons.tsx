import classNames from 'classnames';
import { FunctionComponent } from 'react';

import { BookHalf, Cog, Eraser, Github, Keyboard, Sack } from 'icons';
import { GITHUB_PROJECT_URL } from 'parameters';
import { selectHasInvalidWords, selectHasOverusedTiles, useTranslate, useTypedSelector } from 'state';

import SquareButton from '../SquareButton';

import styles from './NavButtons.module.scss';

interface Props {
  onClear: () => void;
  onShowKeyMap: () => void;
  onShowRemainingTiles: () => void;
  onShowSettings: () => void;
  onShowWords: () => void;
}

const NavButtons: FunctionComponent<Props> = ({
  onClear,
  onShowKeyMap,
  onShowRemainingTiles,
  onShowSettings,
  onShowWords,
}) => {
  const translate = useTranslate();
  const hasOverusedTiles = useTypedSelector(selectHasOverusedTiles);
  const hasInvalidWords = useTypedSelector(selectHasInvalidWords);

  return (
    <div className={styles.navButtons}>
      <SquareButton className={styles.button} Icon={Eraser} tooltip={translate('common.clear')} onClick={onClear} />

      <div className={styles.separator} />

      <SquareButton
        className={classNames(styles.button, {
          [styles.error]: hasOverusedTiles,
        })}
        Icon={Sack}
        tooltip={translate('remaining-tiles')}
        onClick={onShowRemainingTiles}
      />

      <SquareButton
        className={classNames(styles.button, {
          [styles.error]: hasInvalidWords,
        })}
        Icon={BookHalf}
        tooltip={translate('words')}
        onClick={onShowWords}
      />

      <div className={styles.separator} />

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

      <SquareButton className={styles.button} Icon={Cog} tooltip={translate('settings')} onClick={onShowSettings} />
    </div>
  );
};

export default NavButtons;
