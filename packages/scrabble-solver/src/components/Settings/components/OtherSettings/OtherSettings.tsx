import classNames from 'classnames';
import React, { ChangeEvent, FunctionComponent } from 'react';
import { useDispatch } from 'react-redux';

import { selectAutoDirectionChange, settingsSlice, useTranslation, useTypedSelector } from 'state';

import Checkbox from '../../../Checkbox';

import styles from './OtherSettings.module.scss';

interface Props {
  className?: string;
}

const OtherSettings: FunctionComponent<Props> = ({ className }) => {
  const dispatch = useDispatch();
  const autoDirectionChange = useTypedSelector(selectAutoDirectionChange);
  const labelTranslation = useTranslation('settings.autoDirectionChange');
  const titleTranslation = useTranslation('settings.autoDirectionChangeTitle');

  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    dispatch(settingsSlice.actions.changeAutoDirectionChange(event.target.checked));
  };

  return (
    <div className={classNames(styles.otherSettings, className)}>
      <Checkbox
        checked={autoDirectionChange}
        id="autoDirectionChange"
        name="autoDirectionChange"
        title={titleTranslation}
        onChange={handleChange}
      >
        {labelTranslation}
      </Checkbox>
    </div>
  );
};

export default OtherSettings;
