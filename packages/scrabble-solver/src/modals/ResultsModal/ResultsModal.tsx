import { Result } from '@scrabble-solver/types';
import { FunctionComponent, useMemo } from 'react';
import { useDispatch } from 'react-redux';

import { Dictionary, Modal, Results } from 'components';
import { useAppLayout } from 'hooks';
import {
  resultsSlice,
  selectResultCandidate,
  selectSortedFilteredResults,
  useTranslate,
  useTypedSelector,
} from 'state';

import styles from './ResultsModal.module.scss';

interface Props {
  className?: string;
  isOpen: boolean;
  onClose: () => void;
}

const ResultsModal: FunctionComponent<Props> = ({ className, isOpen, onClose }) => {
  const dispatch = useDispatch();
  const translate = useTranslate();
  const { isModalFullWidth, showResultsInModal } = useAppLayout();
  const results = useTypedSelector(selectSortedFilteredResults);
  const resultCandidate = useTypedSelector(selectResultCandidate);
  const index = (results || []).findIndex((result) => result.id === resultCandidate?.id);
  const highlightedIndex = index === -1 ? undefined : index;

  const callbacks = useMemo(
    () => ({
      onClick: (result: Result) => {
        const isSelected = result === resultCandidate;

        if (isSelected) {
          if (showResultsInModal && !isModalFullWidth) {
            dispatch(resultsSlice.actions.applyResult(result));
          }

          onClose();
        } else {
          dispatch(resultsSlice.actions.changeResultCandidate(result));
        }
      },
    }),
    [dispatch, isModalFullWidth, onClose, resultCandidate, showResultsInModal],
  );

  return (
    <Modal className={className} isOpen={isOpen} title={translate('results')} onClose={onClose}>
      <div className={styles.content}>
        <Results callbacks={callbacks} className={styles.results} highlightedIndex={highlightedIndex} />
        <Dictionary className={styles.dictionary} />
      </div>
    </Modal>
  );
};

export default ResultsModal;
