import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';

import ShowWalkthrough from 'walkthrough/components/show';

import ConfigSetting from './config-setting';
import styles from './config.module.scss';

const Config = ({ className }) => (
  <div className={classNames(styles.config, className)}>
    <ConfigSetting />
    <ShowWalkthrough />
  </div>
);

Config.propTypes = {
  className: PropTypes.string
};

export default Config;
