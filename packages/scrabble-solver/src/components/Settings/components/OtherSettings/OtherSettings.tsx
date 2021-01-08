import classNames from 'classnames';
import React, { ChangeEvent, FunctionComponent } from 'react';
import { useDispatch } from 'react-redux';

import { selectAutoDirectionChange, settingsSlice, useTypedSelector } from 'state';

import Checkbox from '../../../Checkbox';

import styles from './OtherSettings.module.scss';

interface Props {
  className?: string;
}

const OtherSettings: FunctionComponent<Props> = ({ className }) => {
  const dispatch = useDispatch();
  const autoDirectionChange = useTypedSelector(selectAutoDirectionChange);

  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    dispatch(settingsSlice.actions.changeAutoDirectionChange(event.target.checked));
  };

  return (
    <div className={classNames(styles.otherSettings, className)}>
      <Checkbox
        checked={autoDirectionChange}
        id="autoDirectionChange"
        name="autoDirectionChange"
        title="Navigating with arrow keys on the board will also change typing direction"
        onChange={handleChange}
      >
        Change typing direction with arrow keys
      </Checkbox>
    </div>
  );
};

export default OtherSettings;
