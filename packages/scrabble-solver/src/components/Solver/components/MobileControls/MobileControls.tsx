import { FunctionComponent, HTMLProps } from 'react';

import {
  selectAreResultsOutdated,
  selectResultCandidate,
  selectSolveError,
  selectSortedResults,
  useTranslate,
  useTypedSelector,
} from 'state';

import EmptyState from '../EmptyState';
import ResultCandidatePicker from '../ResultCandidatePicker';

interface Props extends HTMLProps<HTMLDivElement> {
  onShowResults: () => void;
}

// eslint-disable-next-line max-statements
const MobileControls: FunctionComponent<Props> = ({ onShowResults, ...props }) => {
  const translate = useTranslate();
  const resultCandidate = useTypedSelector(selectResultCandidate);
  const isOutdated = useTypedSelector(selectAreResultsOutdated);
  const allResults = useTypedSelector(selectSortedResults);
  const error = useTypedSelector(selectSolveError);

  return (
    <div {...props}>
      {typeof error !== 'undefined' && (
        <EmptyState variant="error" onClick={onShowResults}>
          {error.message}
        </EmptyState>
      )}

      {typeof error === 'undefined' && typeof allResults === 'undefined' && (
        <EmptyState variant="info" onClick={onShowResults}>
          {translate('results.empty-state.uninitialized')}
        </EmptyState>
      )}

      {typeof error === 'undefined' && typeof allResults !== 'undefined' && (
        <>
          {isOutdated && (
            <EmptyState variant="info" onClick={onShowResults}>
              {translate('results.empty-state.outdated')}
            </EmptyState>
          )}

          {!isOutdated && allResults.length === 0 && (
            <EmptyState variant="warning" onClick={onShowResults}>
              {translate('results.empty-state.no-results')}
            </EmptyState>
          )}

          {!isOutdated && allResults.length > 0 && resultCandidate && <ResultCandidatePicker onClick={onShowResults} />}
        </>
      )}
    </div>
  );
};

export default MobileControls;
