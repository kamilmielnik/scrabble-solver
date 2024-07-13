import { GeoAlt } from 'icons';
import { ResultColumn, ResultColumnId } from 'types';

import styles from './Results.module.scss';

const getCoordinatesColumn = (): ResultColumn => {
  return {
    className: styles.coordinates,
    Icon: GeoAlt,
    id: ResultColumnId.Coordinates,
    translationKey: 'settings.showCoordinates',
    width: 55,
  };
};

export default getCoordinatesColumn;
