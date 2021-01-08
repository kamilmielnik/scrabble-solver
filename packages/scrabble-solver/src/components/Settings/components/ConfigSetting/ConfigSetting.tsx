import classNames from 'classnames';
import React, { ChangeEvent, FunctionComponent } from 'react';
import { useDispatch } from 'react-redux';

import { configIdSlice, selectConfigId, useTypedSelector } from 'state';

import Radio from '../../../Radio';

import styles from './ConfigSetting.module.scss';
import options from './options';

interface Props {
  className?: string;
}

const ConfigSetting: FunctionComponent<Props> = ({ className }) => {
  const dispatch = useDispatch();
  const configId = useTypedSelector(selectConfigId);

  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    dispatch(configIdSlice.actions.change(event.target.value));
  };

  return (
    <div className={classNames(styles.configSetting, className)}>
      {options.map((option) => (
        <Radio
          checked={configId === option.value}
          className={classNames(styles.option, className, {
            [styles.checked]: configId === option.value,
          })}
          id="config"
          key={option.value}
          name="config"
          title={option.label}
          value={option.value}
          onChange={handleChange}
        >
          <div className={styles.label}>{option.label}</div>
        </Radio>
      ))}
    </div>
  );
};

export default ConfigSetting;
