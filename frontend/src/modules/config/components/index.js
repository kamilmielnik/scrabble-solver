import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import ConfigSetting from './config-setting';
import LocaleSetting from './locale-setting';
import styles from './styles.scss';

const Config = ({ className }) => (
  <div className={classNames(styles.config, className)}>
    <ConfigSetting />
    <LocaleSetting />
  </div>
);

Config.propTypes = {
  className: PropTypes.string
};

export default Config;
