import { type FunctionComponent, memo } from 'react';

import { Badge } from '@/components/Badge';
import { Modal } from '@/components/Modal';
import { useMediaQuery } from '@/hooks/useMediaQuery';
import { LOCALE_FEATURES } from '@/i18n/constants';
import { selectLocale, useTranslate, useTypedSelector } from '@/state';

import { Character } from './components';
import styles from './RemainingTilesModal.module.scss';
import { selectRemainingTilesGroups } from './selectors';

interface Props {
  className?: string;
  isOpen: boolean;
  onClose: () => void;
}

const RemainingTilesModalBase: FunctionComponent<Props> = ({ className, isOpen, onClose }) => {
  const translate = useTranslate();
  const coversViewport = useMediaQuery('<s');
  const locale = useTypedSelector(selectLocale);
  const groups = useTypedSelector(selectRemainingTilesGroups);
  const { direction } = LOCALE_FEATURES[locale];

  return (
    <Modal className={className} isOpen={isOpen} title={translate('remaining-tiles')} onClose={onClose}>
      {groups.map(({ remainingCount, tiles, translationKey, totalCount }) => {
        const current = direction === 'ltr' ? remainingCount : totalCount;
        const total = direction === 'ltr' ? totalCount : remainingCount;

        return (
          <Modal.Section
            key={translationKey}
            label={translate(translationKey)}
            title={
              <span className={styles.title}>
                <span>{translate(translationKey)}</span>
                <Badge className={styles.badge}>
                  {current.toLocaleString(locale)} / {total.toLocaleString(locale)}
                </Badge>
              </span>
            }
          >
            <div className={styles.content}>
              {tiles.map((tile) => {
                return (
                  <div className={styles.character} key={tile.character}>
                    <Character highlightsTiles={!coversViewport} tile={tile} />
                  </div>
                );
              })}
            </div>
          </Modal.Section>
        );
      })}
    </Modal>
  );
};

export const RemainingTilesModal = memo(RemainingTilesModalBase);
