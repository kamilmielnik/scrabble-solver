import { type ChangeEvent, type FunctionComponent } from 'react';
import { useDispatch } from 'react-redux';

import { Radio } from 'components';
import { selectRemoveCellFilters, settingsSlice, useTranslate, useTypedSelector } from 'state';

import { parseValue } from './lib';
import styles from './RemoveCellFiltersSetting.module.scss';

interface Props {
  className?: string;
  disabled?: boolean;
}

export const RemoveCellFiltersSetting: FunctionComponent<Props> = ({ className, disabled }) => {
  const dispatch = useDispatch();
  const translate = useTranslate();
  const value = useTypedSelector(selectRemoveCellFilters);

  const options = [
    {
      label: translate('settings.removeCellFilters.always'),
      value: 'always',
    },
    {
      label: translate('settings.removeCellFilters.never'),
      value: 'never',
    },
  ];

  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    const removeTileFilter = parseValue(event.target.value);
    dispatch(settingsSlice.actions.changeRemoveCellFilters(removeTileFilter));
  };

  return (
    <div className={className}>
      {options.map((option) => (
        <Radio
          checked={value === option.value}
          className={styles.option}
          disabled={disabled}
          key={option.value}
          name="removeCellFilters"
          value={option.value}
          onChange={handleChange}
        >
          <div className={styles.label}>{option.label}</div>
        </Radio>
      ))}
    </div>
  );
};
