import { FunctionComponent } from 'react';
import { useDispatch } from 'react-redux';

import { Check } from 'icons';
import { resultsSlice, selectResultCandidate, useTypedSelector } from 'state';

import Button from '../../../Button';

import styles from './ApplyButton.module.scss';

interface Props {
  className?: string;
}

const ApplyButton: FunctionComponent<Props> = ({ className }) => {
  const dispatch = useDispatch();
  const resultCandidate = useTypedSelector(selectResultCandidate);

  const handleClick = () => {
    if (resultCandidate) {
      dispatch(resultsSlice.actions.applyResult(resultCandidate));
    }
  };

  return (
    <Button
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

export default ApplyButton;
