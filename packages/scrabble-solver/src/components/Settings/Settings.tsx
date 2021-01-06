import classNames from 'classnames';
import React, { FunctionComponent } from 'react';

import Screen from '../Screen';

import styles from './Settings.module.scss';

interface Props {
  className?: string;
}

const Settings: FunctionComponent<Props> = ({ className }) => (
  <Screen className={classNames(styles.settings, className)}>

  </Screen>
);

export default Settings;
