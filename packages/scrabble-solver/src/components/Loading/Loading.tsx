import classNames from 'classnames';
import React, { FunctionComponent, ReactNode } from 'react';

import styles from './Loading.module.scss';
import Spinner from './Spinner';

interface Props {
  children?: ReactNode;
  className?: string;
  isLoading?: boolean;
}

const Loading: FunctionComponent<Props> = ({ children, className, isLoading }) => (
  <div
    className={classNames(styles.loading, className, {
      [styles.isLoading]: isLoading,
    })}
  >
    {children}

    {isLoading && (
      <div className={styles.dim}>
        <Spinner className={styles.spinner} />
      </div>
    )}
  </div>
);

export default Loading;
