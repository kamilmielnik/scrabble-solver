import classNames from 'classnames';
import React, { FunctionComponent } from 'react';

import { useTranslation } from 'state';

import PlainTiles from '../PlainTiles';

import styles from './Loading.module.scss';
import useInfiniteProgress from './useInfiniteProgress';

interface Props {
  children?: never;
  className?: string;
  estimatedDuration?: number;
}

const Loading: FunctionComponent<Props> = ({ className, estimatedDuration }) => {
  const loading = useTranslation('loading');
  const content: string[][] = [[loading.toUpperCase()]];
  const progress = useInfiniteProgress(estimatedDuration);
  const progressPercent = `${(progress * 100).toFixed(2)}%`;

  return (
    <div className={classNames(styles.loading, className)}>
      <div className={styles.dim} />
      <div className={styles.logo}>
        <PlainTiles className={classNames(styles.logoGrayscale)} content={content} />
        <PlainTiles
          className={classNames(styles.logoColor)}
          content={content}
          style={{ clipPath: `polygon(0% 0%, ${progressPercent} 0, ${progressPercent} 100%, 0% 100%)` }}
        />
      </div>
    </div>
  );
};

export default Loading;
