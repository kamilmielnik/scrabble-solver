import classNames from 'classnames';
import { FunctionComponent } from 'react';
import { useDispatch } from 'react-redux';

import { Check } from 'icons';
import { resultsSlice, selectAreResultsOutdated, selectResultCandidate, useTranslate, useTypedSelector } from 'state';

import Button from '../../../Button';

import styles from './InsertButton.module.scss';

interface Props {
  className?: string;
}

const InsertButton: FunctionComponent<Props> = ({ className }) => {
  const dispatch = useDispatch();
  const translate = useTranslate();
  const resultCandidate = useTypedSelector(selectResultCandidate);
  const isOutdated = useTypedSelector(selectAreResultsOutdated);

  const handleClick = () => {
    if (resultCandidate) {
      dispatch(resultsSlice.actions.applyResult(resultCandidate));
    }
  };

  return (
    <Button
      aria-label={translate('results.insert')}
      className={classNames(styles.insertButton, className)}
      disabled={isOutdated || !resultCandidate}
      Icon={Check}
      iconClassName={styles.icon}
      type="submit"
      variant="primary"
      onClick={handleClick}
    />
  );
};

export default InsertButton;
