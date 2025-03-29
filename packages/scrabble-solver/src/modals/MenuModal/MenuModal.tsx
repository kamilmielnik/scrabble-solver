import { type FunctionComponent, memo } from 'react';

import { Button, Modal } from 'components';
import { LOCALE_FEATURES } from 'i18n';
import { BookHalf, CardChecklist, Cog, Github, Sack } from 'icons';
import { GITHUB_PROJECT_URL } from 'parameters';
import { selectLocale, useTranslate, useTypedSelector } from 'state';

import styles from './MenuModal.module.scss';

interface Props {
  className?: string;
  isOpen: boolean;
  onClose: () => void;
  onShowDictionary: () => void;
  onShowRemainingTiles: () => void;
  onShowSettings: () => void;
  onShowWords: () => void;
}

const MenuModalBase: FunctionComponent<Props> = ({
  className,
  isOpen,
  onClose,
  onShowDictionary,
  onShowRemainingTiles,
  onShowSettings,
  onShowWords,
}) => {
  const translate = useTranslate();
  const locale = useTypedSelector(selectLocale);
  const { Icon } = LOCALE_FEATURES[locale];

  return (
    <Modal className={className} isOpen={isOpen} title={translate('menu')} onClose={onClose}>
      <Button
        aria-label={translate('remaining-tiles')}
        className={styles.button}
        Icon={Sack}
        wide
        onClick={onShowRemainingTiles}
      >
        {translate('remaining-tiles')}
      </Button>

      <Button aria-label={translate('words')} className={styles.button} Icon={CardChecklist} wide onClick={onShowWords}>
        {translate('words')}
      </Button>

      <Button
        aria-label={translate('dictionary')}
        className={styles.button}
        Icon={BookHalf}
        wide
        onClick={onShowDictionary}
      >
        {translate('dictionary')}
      </Button>

      <Button.Link
        aria-label={translate('github')}
        className={styles.button}
        href={GITHUB_PROJECT_URL}
        Icon={Github}
        rel="noopener noreferrer"
        target="_blank"
        wide
      >
        {translate('github')}
      </Button.Link>

      <Button aria-label={translate('settings')} className={styles.button} Icon={Cog} wide onClick={onShowSettings}>
        <div className={styles.settings}>
          <div className={styles.settingsLabel}>{translate('settings')}</div>
          <Icon aria-hidden="true" className={styles.flag} role="img" />
        </div>
      </Button>
    </Modal>
  );
};

export const MenuModal = memo(MenuModalBase);
