import { type ChangeEvent, type FunctionComponent } from 'react';
import { useDispatch } from 'react-redux';

import { Radio } from '@/components';
import { selectHighlightUnreachableCells, settingsSlice, useTranslate, useTypedSelector } from '@/state';

import styles from './HighlightUnreachableCellsSetting.module.scss';

interface Props {
  className?: string;
  disabled?: boolean;
}

export const HighlightUnreachableCellsSetting: FunctionComponent<Props> = ({ className, disabled }) => {
  const dispatch = useDispatch();
  const translate = useTranslate();
  const value = useTypedSelector(selectHighlightUnreachableCells);

  const options = [
    {
      label: translate('common.off'),
      value: 'off',
    },
    {
      label: translate('common.on'),
      value: 'on',
    },
  ];

  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    dispatch(settingsSlice.actions.changeHighlightUnreachableCells(event.target.value === 'on'));
  };

  return (
    <div className={className}>
      {options.map((option) => (
        <Radio
          checked={(value ? 'on' : 'off') === option.value}
          className={styles.option}
          disabled={disabled}
          key={option.value}
          name="highlightUnreachableCells"
          value={option.value}
          onChange={handleChange}
        >
          <div className={styles.label}>{option.label}</div>
        </Radio>
      ))}
    </div>
  );
};
