import { GeoAltFill } from 'icons';
import { ResultColumn } from 'types';

import styles from './Results.module.scss';
import { Column } from './types';

const getCoordinatesColumn = (): Column => {
  return {
    className: styles.coordinates,
    Icon: GeoAltFill,
    id: ResultColumn.Coordinates,
    translationKey: 'settings.showCoordinates',
  };
};

export default getCoordinatesColumn;
