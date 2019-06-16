import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import Separators from './separators';
import Toggle from './toggle';
import styles from './setting.module.scss';

const Setting = ({ className, id, label, options, value, onChange }) => (
  <div className={classNames(styles.setting, className)} id={id}>
    {label}:
    <Separators className={styles.separators}>
      {options.map((option, index) => (
        <Toggle key={index} isActive={value === option.value} onClick={() => onChange(option.value)}>
          {option.label}
        </Toggle>
      ))}
    </Separators>
  </div>
);

Setting.propTypes = {
  className: PropTypes.string,
  id: PropTypes.string,
  label: PropTypes.string.isRequired,
  options: PropTypes.array.isRequired,
  value: PropTypes.any.isRequired,
  onChange: PropTypes.func.isRequired
};

export default Setting;
