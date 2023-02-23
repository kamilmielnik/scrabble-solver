import { FunctionComponent } from 'react';

import { Button, Modal } from 'components';
import { CardChecklist, Cog, Github, Sack } from 'icons';
import { GITHUB_PROJECT_URL } from 'parameters';
import { useTranslate } from 'state';

import styles from './MenuModal.module.scss';

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
      <Button
        aria-label={translate('remaining-tiles')}
        className={styles.button}
        Icon={Sack}
        onClick={onShowRemainingTiles}
      >
        {translate('remaining-tiles')}
      </Button>

      <Button aria-label={translate('words')} className={styles.button} Icon={CardChecklist} onClick={onShowWords}>
        {translate('words')}
      </Button>

      <Button.Link
        aria-label={translate('github')}
        className={styles.button}
        href={GITHUB_PROJECT_URL}
        Icon={Github}
        rel="noopener noreferrer"
        target="_blank"
      >
        {translate('github')}
      </Button.Link>

      <Button aria-label={translate('settings')} className={styles.button} Icon={Cog} onClick={onShowSettings}>
        {translate('settings')}
      </Button>
    </Modal>
  );
};

export default Menu;
