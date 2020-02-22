import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';

import Separators from './Separators';
import Toggle from './Toggle';
import styles from './Setting.module.scss';

const Setting = ({ className, id, options, value, onChange }) => (
  <div className={classNames(styles.setting, className)} id={id}>
    <Separators separator="/">
      {options.map((option) => (
        <Toggle active={value === option.value} key={option.label} onClick={() => onChange(option.value)}>
          {option.label}
        </Toggle>
      ))}
    </Separators>
  </div>
);

Setting.propTypes = {
  className: PropTypes.string,
  id: PropTypes.string,
  options: PropTypes.arrayOf(
    PropTypes.shape({
      label: PropTypes.string.isRequired,
      value: PropTypes.any.isRequired
    }).isRequired
  ).isRequired,
  value: PropTypes.any.isRequired,
  onChange: PropTypes.func.isRequired
};

export default Setting;
