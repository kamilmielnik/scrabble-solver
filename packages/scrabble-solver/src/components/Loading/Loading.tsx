import classNames from 'classnames';
import React, { FunctionComponent } from 'react';

import styles from './Loading.module.scss';
import Spinner from './Spinner';

interface Props {
  children?: never;
  className?: string;
}

const Loading: FunctionComponent<Props> = ({ className }) => (
  <div className={classNames(styles.loading, className)}>
    <div className={styles.dim} />
    <div className={styles.spinner}>
      <Spinner />
    </div>
  </div>
);

export default Loading;
