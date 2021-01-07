import classNames from 'classnames';
import React, { FunctionComponent } from 'react';

import { LocaleOption } from './components';
import styles from './LocaleSetting.module.scss';
import options from './options';

interface Props {
  className?: string;
}

const LocaleSetting: FunctionComponent<Props> = ({ className }) => (
  <div className={classNames(styles.localeSetting, className)}>
    {options.map((option) => (
      <LocaleOption key={option.value} option={option} />
    ))}
  </div>
);

export default LocaleSetting;
