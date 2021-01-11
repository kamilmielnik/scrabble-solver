import React, { ChangeEvent, FunctionComponent } from 'react';
import { useDispatch } from 'react-redux';

import { selectAutoMoveTiles, settingsSlice, useTranslate, useTypedSelector } from 'state';

import Radio from '../../../Radio';

import styles from './AutoMoveTilesSetting.module.scss';
import { NULL_VALUE } from './constants';
import { parseValue } from './lib';

interface Props {
  className?: string;
  disabled?: boolean;
}

const AutoMoveTilesSetting: FunctionComponent<Props> = ({ className, disabled }) => {
  const dispatch = useDispatch();
  const translate = useTranslate();
  const configId = useTypedSelector(selectAutoMoveTiles);

  const options = [
    {
      label: translate('settings.autoMoveTiles.left'),
      value: 'left',
    },
    {
      label: translate('settings.autoMoveTiles.right'),
      value: 'right',
    },
    {
      label: translate('settings.autoMoveTiles.null'),
      value: NULL_VALUE,
    },
  ];

  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    const autoMoveTiles = parseValue(event.target.value);
    dispatch(settingsSlice.actions.changeAutoMoveTiles(autoMoveTiles));
  };

  return (
    <div className={className}>
      {options.map((option) => (
        <Radio
          checked={configId === option.value}
          className={styles.option}
          disabled={disabled}
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

export default AutoMoveTilesSetting;
