import { ChangeEvent, FunctionComponent } from 'react';
import { useDispatch } from 'react-redux';

import { Radio } from 'components';
import { selectAutoGroupTiles, settingsSlice, useTranslate, useTypedSelector } from 'state';

import styles from './AutoGroupTilesSetting.module.scss';
import { NULL_VALUE } from './constants';
import { parseValue } from './lib';

interface Props {
  className?: string;
  disabled?: boolean;
}

const AutoGroupTilesSetting: FunctionComponent<Props> = ({ className, disabled }) => {
  const dispatch = useDispatch();
  const translate = useTranslate();
  const value = useTypedSelector(selectAutoGroupTiles);

  const options = [
    {
      label: translate('settings.autoGroupTiles.left'),
      value: 'left',
    },
    {
      label: translate('settings.autoGroupTiles.right'),
      value: 'right',
    },
    {
      label: translate('settings.autoGroupTiles.null'),
      value: NULL_VALUE,
    },
  ];

  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    const autoGroupTiles = parseValue(event.target.value);
    dispatch(settingsSlice.actions.changeAutoGroupTiles(autoGroupTiles));
  };

  return (
    <div className={className}>
      {options.map((option) => (
        <Radio
          checked={value === parseValue(option.value)}
          className={styles.option}
          disabled={disabled}
          key={option.value}
          label={option.label}
          name="autoGroupTiles"
          value={option.value}
          onChange={handleChange}
        >
          <div className={styles.label}>{option.label}</div>
        </Radio>
      ))}
    </div>
  );
};

export default AutoGroupTilesSetting;
