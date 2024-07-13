import { FunctionComponent, memo } from 'react';

import { Badge, Modal } from 'components';
import { LOCALE_FEATURES } from 'i18n';
import { getTileSizes } from 'lib';
import { REMAINING_TILES_TILE_SIZE } from 'parameters';
import { selectLocale, selectRemainingTilesGroups, useTranslate, useTypedSelector } from 'state';

import { Character } from './components';
import styles from './RemainingTilesModal.module.scss';

interface Props {
  className?: string;
  isOpen: boolean;
  onClose: () => void;
}

const RemainingTilesModal: FunctionComponent<Props> = ({ className, isOpen, onClose }) => {
  const translate = useTranslate();
  const locale = useTypedSelector(selectLocale);
  const groups = useTypedSelector(selectRemainingTilesGroups);
  const { tileFontSize } = getTileSizes(REMAINING_TILES_TILE_SIZE);
  const { direction } = LOCALE_FEATURES[locale];

  return (
    <Modal className={className} isOpen={isOpen} title={translate('remaining-tiles')} onClose={onClose}>
      {groups.map(({ remainingCount, tiles, translationKey, totalCount }) => {
        const current = direction === 'ltr' ? remainingCount : totalCount;
        const total = direction === 'ltr' ? totalCount : remainingCount;
        const label = `${current.toLocaleString(locale)} / ${total.toLocaleString(locale)}`;

        return (
          <Modal.Section
            key={translationKey}
            label={label}
            title={
              <span className={styles.title}>
                <span>{translate(translationKey)}</span>
                <Badge className={styles.badge}>{label}</Badge>
              </span>
            }
          >
            <div className={styles.content} style={{ fontSize: tileFontSize }}>
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

export default memo(RemainingTilesModal);
