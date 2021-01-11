import React, { ChangeEvent, FunctionComponent } from 'react';
import { useDispatch } from 'react-redux';

import { selectAutoDirectionChange, settingsSlice, useTranslate, useTypedSelector } from 'state';

import Checkbox from '../../../Checkbox';

interface Props {
  className?: string;
  disabled: boolean;
}

const OtherSettings: FunctionComponent<Props> = ({ className, disabled }) => {
  const dispatch = useDispatch();
  const translate = useTranslate();
  const autoDirectionChange = useTypedSelector(selectAutoDirectionChange);

  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    dispatch(settingsSlice.actions.changeAutoDirectionChange(event.target.checked));
  };

  return (
    <div className={className}>
      <Checkbox
        checked={autoDirectionChange}
        disabled={disabled}
        id="autoDirectionChange"
        name="autoDirectionChange"
        title={translate('settings.autoDirectionChangeTitle')}
        onChange={handleChange}
      >
        {translate('settings.autoDirectionChange')}
      </Checkbox>
    </div>
  );
};

export default OtherSettings;
