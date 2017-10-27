import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import Separators from './separators';
import Toggle from './toggle';
import styles from './styles.scss';

const Setting = ({ className, label, options, value, onChange }) => (
  <div className={classNames(styles.setting, className)}>
    {label}:
    <Separators className={styles.separators}>
      {options.map((option, index) => (
        <Toggle
          key={index}
          isActive={value === option.value}
          onClick={() => onChange(option.value)}>
          {option.label}
        </Toggle>
      ))}
    </Separators>
  </div>
);

Setting.propTypes = {
  className: PropTypes.string,
  label: PropTypes.string.isRequired,
  options: PropTypes.array.isRequired,
  value: PropTypes.any.isRequired,
  onChange: PropTypes.func.isRequired
};

export default Setting;
