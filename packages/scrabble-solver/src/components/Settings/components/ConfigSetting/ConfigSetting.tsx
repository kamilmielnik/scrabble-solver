import React, { ChangeEvent, FunctionComponent } from 'react';
import { useDispatch } from 'react-redux';

import { selectConfigId, settingsSlice, useTypedSelector } from 'state';

import Radio from '../../../Radio';

import styles from './ConfigSetting.module.scss';
import options from './options';

interface Props {
  className?: string;
  disabled?: boolean;
}

const ConfigSetting: FunctionComponent<Props> = ({ className, disabled }) => {
  const dispatch = useDispatch();
  const configId = useTypedSelector(selectConfigId);

  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    dispatch(settingsSlice.actions.changeConfigId(event.target.value));
  };

  return (
    <div className={className}>
      {options.map((option) => (
        <Radio
          checked={configId === option.value}
          className={styles.option}
          disabled={disabled}
          id="configId"
          key={option.value}
          name="configId"
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
