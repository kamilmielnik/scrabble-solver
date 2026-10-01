import { type ChangeEvent, type FunctionComponent } from 'react';
import { useDispatch } from 'react-redux';

import { Radio } from '@/components/Radio';
import { selectFirstMoveWordMultiplier, settingsSlice, useTranslate, useTypedSelector } from '@/state';

import styles from './FirstMoveWordMultiplierSetting.module.scss';

interface Props {
  disabled?: boolean;
}

export const FirstMoveWordMultiplierSetting: FunctionComponent<Props> = ({ disabled }) => {
  const dispatch = useDispatch();
  const translate = useTranslate();
  const enabled = useTypedSelector(selectFirstMoveWordMultiplier);

  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    dispatch(settingsSlice.actions.changeFirstMoveWordMultiplier(event.target.value === 'on'));
  };

  return (
    <>
      {(['off', 'on'] as const).map((value) => (
        <Radio
          checked={(enabled ? 'on' : 'off') === value}
          className={styles.option}
          disabled={disabled}
          key={value}
          name="firstMoveWordMultiplier"
          value={value}
          onChange={handleChange}
        >
          <div className={styles.label}>{translate(`common.${value}`)}</div>
        </Radio>
      ))}
    </>
  );
};
