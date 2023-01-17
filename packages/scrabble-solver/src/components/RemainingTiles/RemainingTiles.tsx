import { FunctionComponent } from 'react';

import { selectLocale, selectRemainingTilesGroups, useTranslate, useTypedSelector } from 'state';

import Badge from '../Badge';
import Sidebar from '../Sidebar';

import Character from './Character';
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

  return (
    <Sidebar className={className} isOpen={isOpen} title={translate('remaining-tiles')} onClose={onClose}>
      {groups.map(({ remainingCount, tiles, translationKey, totalCount }) => (
        <Sidebar.Section
          key={translationKey}
          title={
            <span className={styles.title}>
              <span>{translate(translationKey)}</span>
              <Badge className={styles.badge}>
                {remainingCount.toLocaleString(locale)} / {totalCount.toLocaleString(locale)}
              </Badge>
            </span>
          }
        >
          <div className={styles.content}>
            {tiles.map((tile) => {
              return <Character key={tile.character} tile={tile} />;
            })}
          </div>
        </Sidebar.Section>
      ))}
    </Sidebar>
  );
};

export default RemainingTiles;
