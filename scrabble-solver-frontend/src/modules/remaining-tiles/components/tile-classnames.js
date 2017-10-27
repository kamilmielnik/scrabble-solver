import styles from './styles.scss';

const classNamesPerPoints = {
  0: styles.points0,
  1: styles.points1,
  2: styles.points2,
  3: styles.points3
};

export const getTileClassNames = ({ count, points, usedCount }) => {
  if (usedCount >= count) {
    return null;
  }

  return classNamesPerPoints[points] || styles.points5Plus;
};
