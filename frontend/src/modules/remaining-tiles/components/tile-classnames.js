import styles from './styles.scss';

export const getTileClassNames = ({ count, points, usedCount }) => {
  if(usedCount >= count) {
    return null;
  }

  if(points === 1) {
    return styles.points1;
  }

  if(points === 2) {
    return styles.points2;
  }

  if(points === 3) {
    return styles.points3;
  }

  return styles.points5Plus;
};
