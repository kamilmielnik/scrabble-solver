import classNames from 'classnames';
import { FunctionComponent, MouseEventHandler } from 'react';
import { useDispatch } from 'react-redux';

import { Search } from 'icons';
import { noop } from 'lib';
import {
  selectAreResultsOutdated,
  selectIsLoading,
  selectRack,
  solveSlice,
  useTranslate,
  useTypedSelector,
} from 'state';

import Button from '../../../Button';
import Spinner from '../../../Spinner';

import styles from './FloatingSolveButton.module.scss';

interface Props {
  className?: string;
  onClick?: MouseEventHandler;
}

const FloatingSolveButton: FunctionComponent<Props> = ({ className, onClick = noop }) => {
  const dispatch = useDispatch();
  const translate = useTranslate();
  const isLoading = useTypedSelector(selectIsLoading);
  const isOutdated = useTypedSelector(selectAreResultsOutdated);
  const rack = useTypedSelector(selectRack);
  const hasTiles = rack.some((tile) => tile !== null);

  const handleClick: MouseEventHandler = (event) => {
    dispatch(solveSlice.actions.submit());
    onClick(event);
  };

  return (
    <Button
      aria-label={translate('results.solve')}
      className={classNames(styles.floatingSolveButton, className)}
      disabled={isLoading || !isOutdated || !hasTiles}
      Icon={isLoading ? Spinner : Search}
      tooltip={translate('results.solve')}
      type="submit"
      variant="primary"
      onClick={handleClick}
    />
  );
};

export default FloatingSolveButton;
