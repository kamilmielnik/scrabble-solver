import { ShowCoordinates } from '@scrabble-solver/types';
import { ChangeEvent, FunctionComponent } from 'react';
import { useDispatch } from 'react-redux';

import { Radio } from 'components';
import { selectShowCoordinates, settingsSlice, useTranslate, useTypedSelector } from 'state';

import styles from './ShowCoordinatesSetting.module.scss';

interface Props {
  className?: string;
  disabled?: boolean;
}

const ShowCoordinatesSetting: FunctionComponent<Props> = ({ className, disabled }) => {
  const dispatch = useDispatch();
  const translate = useTranslate();
  const value = useTypedSelector(selectShowCoordinates);

  const options = [
    {
      label: translate('settings.showCoordinates.hidden'),
      value: 'hidden',
    },
    {
      label: translate('settings.showCoordinates.original'),
      value: 'original',
    },
    {
      label: translate('settings.showCoordinates.alternative'),
      value: 'alternative',
    },
  ];

  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    const showCoordinates = event.target.value as ShowCoordinates;
    dispatch(settingsSlice.actions.changeShowCoordinates(showCoordinates));
  };

  return (
    <div className={className}>
      {options.map((option) => (
        <Radio
          checked={String(value) === option.value}
          className={styles.option}
          disabled={disabled}
          key={option.value}
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

export default ShowCoordinatesSetting;
