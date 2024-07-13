import { ChangeEvent, FunctionComponent } from 'react';
import { useDispatch } from 'react-redux';

import { Radio } from 'components';
import { selectInputMode, settingsSlice, useTranslate, useTypedSelector } from 'state';

import styles from './InputModeSetting.module.scss';
import { parseValue } from './lib';

interface Props {
  className?: string;
  disabled?: boolean;
}

const InputModeSetting: FunctionComponent<Props> = ({ className, disabled }) => {
  const dispatch = useDispatch();
  const translate = useTranslate();
  const value = useTypedSelector(selectInputMode);

  const options = [
    {
      label: translate('settings.inputMode.keyboard'),
      value: 'keyboard',
    },
    {
      label: translate('settings.inputMode.touchscreen'),
      value: 'touchscreen',
    },
  ];

  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    const inputMode = parseValue(event.target.value);
    dispatch(settingsSlice.actions.changeInputMode(inputMode));
  };

  return (
    <div className={className}>
      {options.map((option) => (
        <Radio
          checked={value === option.value}
          className={styles.option}
          disabled={disabled}
          key={option.value}
          label={option.label}
          name="inputMode"
          value={option.value}
          onChange={handleChange}
        >
          <div className={styles.label}>{option.label}</div>
        </Radio>
      ))}
    </div>
  );
};

export default InputModeSetting;
