import { FunctionComponent } from 'react';
import { useDispatch } from 'react-redux';

import { Check } from 'icons';
import { resultsSlice, selectResultCandidate, useTranslate, useTypedSelector } from 'state';

import Button from '../../../Button';

import styles from './InsertButton.module.scss';

interface Props {
  className?: string;
}

const InsertButton: FunctionComponent<Props> = ({ className }) => {
  const dispatch = useDispatch();
  const translate = useTranslate();
  const resultCandidate = useTypedSelector(selectResultCandidate);

  const handleClick = () => {
    if (resultCandidate) {
      dispatch(resultsSlice.actions.applyResult(resultCandidate));
    }
  };

  return (
    <Button
      aria-label={translate('results.insert')}
      className={className}
      disabled={!resultCandidate}
      Icon={Check}
      iconClassName={styles.icon}
      type="submit"
      variant="primary"
      onClick={handleClick}
    />
  );
};

export default InsertButton;
