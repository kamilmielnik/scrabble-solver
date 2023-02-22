import { FunctionComponent } from 'react';
import { useDispatch } from 'react-redux';

import { Search } from 'icons';
import {
  selectAreResultsOutdated,
  selectIsLoading,
  selectRack,
  solveSlice,
  useTranslate,
  useTypedSelector,
} from 'state';

import Button from '../Button';

interface Props {
  className?: string;
}

const SolveButton: FunctionComponent<Props> = ({ className }) => {
  const dispatch = useDispatch();
  const translate = useTranslate();
  const isLoading = useTypedSelector(selectIsLoading);
  const rack = useTypedSelector(selectRack);
  const isOutdated = useTypedSelector(selectAreResultsOutdated);
  const hasTiles = rack.some((tile) => tile !== null);

  const handleClick = () => {
    dispatch(solveSlice.actions.submit());
  };

  return (
    <Button
      className={className}
      disabled={isLoading || !isOutdated || !hasTiles}
      Icon={Search}
      type="submit"
      variant="primary"
      onClick={handleClick}
    >
      {translate('results.solve')}
    </Button>
  );
};

export default SolveButton;
