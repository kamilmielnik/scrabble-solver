import { Result } from '@scrabble-solver/types';
import { FunctionComponent, useMemo } from 'react';
import { useDispatch } from 'react-redux';

import { Dictionary, Modal, Results } from 'components';
import { resultsSlice, selectResultCandidate, selectResults, useTranslate, useTypedSelector } from 'state';

import styles from './ResultsModal.module.scss';

interface Props {
  className?: string;
  isOpen: boolean;
  onClose: () => void;
}

const ResultsModal: FunctionComponent<Props> = ({ className, isOpen, onClose }) => {
  const dispatch = useDispatch();
  const translate = useTranslate();
  const results = useTypedSelector(selectResults);
  const resultCandidate = useTypedSelector(selectResultCandidate);
  const index = results ? results.findIndex((result) => result.id === resultCandidate?.id) : -1;
  const highlightedIndex = index === -1 ? undefined : index;

  const callbacks = useMemo(
    () => ({
      onClick: (result: Result) => {
        const isSelected = result === resultCandidate;

        if (isSelected) {
          onClose();
        } else {
          dispatch(resultsSlice.actions.changeResultCandidate(result));
        }
      },
    }),
    [dispatch, onClose, resultCandidate],
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
