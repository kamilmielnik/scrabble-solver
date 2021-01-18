import classNames from 'classnames';
import React, { FunctionComponent } from 'react';

import Logo from '../Logo';
import Screen from '../Screen';

import styles from './Splash.module.scss';

interface Props {
  className?: string;
  forceShow?: boolean;
}

const Splash: FunctionComponent<Props> = ({ className, forceShow }) => (
  <Screen
    className={classNames(styles.splash, className, {
      [styles.animated]: !forceShow,
    })}
  >
    <div className={styles.logos}>
      <Logo className={styles.logoGrayscale} />
      <Logo className={styles.logoColor} />
    </div>

    <h1 className={styles.author}>by Kamil Mielnik</h1>
  </Screen>
);

export default Splash;
