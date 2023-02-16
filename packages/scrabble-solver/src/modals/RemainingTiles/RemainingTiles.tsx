import { FunctionComponent } from 'react';

import { Badge, Modal } from 'components';
import { LOCALE_FEATURES } from 'i18n';
import { selectLocale, selectRemainingTilesGroups, useTranslate, useTypedSelector } from 'state';

import { Character } from './components';
import styles from './RemainingTiles.module.scss';

interface Props {
  className?: string;
  isOpen: boolean;
  onClose: () => void;
}

const RemainingTiles: FunctionComponent<Props> = ({ className, isOpen, onClose }) => {
  const translate = useTranslate();
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
                    <Character tile={tile} />
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

export default RemainingTiles;
