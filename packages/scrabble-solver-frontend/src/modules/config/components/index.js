import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import ConfigSetting from './config-setting';
import LocaleSetting from './locale-setting';
import ShowWalkthrough from 'walkthrough/components/show';
import styles from './config.module.scss';

const Config = ({ className }) => (
  <div className={classNames(styles.config, className)}>
    <ConfigSetting />
    <LocaleSetting />
    <ShowWalkthrough />
  </div>
);

Config.propTypes = {
  className: PropTypes.string
};

export default Config;
