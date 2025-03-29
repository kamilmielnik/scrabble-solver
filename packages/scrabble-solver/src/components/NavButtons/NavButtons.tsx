import classNames from 'classnames';
import { type FunctionComponent, memo } from 'react';

import { useAppLayout } from 'hooks';
import { CardChecklist, Cog, Eraser, Github, KeyboardFill, List, Sack } from 'icons';
import { GITHUB_PROJECT_URL } from 'parameters';
import { selectConfig, useTranslate, useTypedSelector } from 'state';

import { IconButton } from '../IconButton';

import styles from './NavButtons.module.scss';
import { selectHasInvalidWords, selectHasOverusedTiles } from './selectors';

interface Props {
  onClear: () => void;
  onShowKeyMap: () => void;
  onShowMenu: () => void;
  onShowRemainingTiles: () => void;
  onShowSettings: () => void;
  onShowWords: () => void;
}

const NavButtonsBase: FunctionComponent<Props> = ({
  onClear,
  onShowKeyMap,
  onShowMenu,
  onShowRemainingTiles,
  onShowSettings,
  onShowWords,
}) => {
  const translate = useTranslate();
  const config = useTypedSelector(selectConfig);
  const hasInvalidWords = useTypedSelector(selectHasInvalidWords);
  const hasOverusedTiles = useTypedSelector(selectHasOverusedTiles);
  const { showKeyMap, showShortNav } = useAppLayout();

  if (showShortNav) {
    return (
      <div className={styles.navButtons}>
        <div className={styles.group}>
          <IconButton
            aria-label={translate('common.clear')}
            className={styles.button}
            Icon={Eraser}
            tooltip={translate('common.clear')}
            onClick={onClear}
          />
        </div>

        <div className={styles.separator} />

        <div className={styles.group}>
          <IconButton
            aria-label={translate('menu')}
            className={styles.button}
            Icon={List}
            tooltip={translate('menu')}
            onClick={onShowMenu}
          />
        </div>
      </div>
    );
  }

  return (
    <div className={styles.navButtons}>
      <div className={styles.group}>
        <IconButton
          aria-label={translate('common.clear')}
          className={styles.button}
          Icon={Eraser}
          tooltip={translate('common.clear')}
          onClick={onClear}
        />
      </div>

      <div className={styles.separator} />

      <div className={styles.group}>
        {config.supportsRemainingTiles && (
          <IconButton
            aria-label={translate('remaining-tiles')}
            className={classNames(styles.button, {
              [styles.error]: hasOverusedTiles,
            })}
            Icon={Sack}
            tooltip={translate('remaining-tiles')}
            onClick={onShowRemainingTiles}
          />
        )}

        <IconButton
          aria-label={translate('words')}
          className={classNames(styles.button, {
            [styles.error]: hasInvalidWords,
          })}
          Icon={CardChecklist}
          tooltip={translate('words')}
          onClick={onShowWords}
        />
      </div>

      <div className={styles.separator} />

      <div className={styles.group}>
        <IconButton.Link
          aria-label={translate('github')}
          className={styles.button}
          href={GITHUB_PROJECT_URL}
          Icon={Github}
          rel="noopener noreferrer"
          target="_blank"
          tooltip={translate('github')}
        />
      </div>

      <div className={styles.separator} />

      <div className={styles.group}>
        {showKeyMap && (
          <IconButton
            aria-label={translate('keyMap')}
            className={styles.button}
            Icon={KeyboardFill}
            tooltip={translate('keyMap')}
            onClick={onShowKeyMap}
          />
        )}

        <IconButton
          aria-label={translate('settings')}
          data-testid="settings-button"
          className={styles.button}
          Icon={Cog}
          tooltip={translate('settings')}
          onClick={onShowSettings}
        />
      </div>
    </div>
  );
};

export const NavButtons = memo(NavButtonsBase);
