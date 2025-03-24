import { Result } from '@scrabble-solver/types';
import { FunctionComponent, memo, useEffect, useMemo } from 'react';
import { useDispatch } from 'react-redux';

import { Button, Dictionary, Modal, Results } from 'components';
import { useAppLayout } from 'hooks';
import { Check, EyeFill } from 'icons';
import { resultsSlice, selectResultCandidate, selectResults, useTranslate, useTypedSelector } from 'state';

import styles from './ResultsModal.module.scss';

interface Props {
  className?: string;
  isOpen: boolean;
  onClose: () => void;
}

const ResultsModalBase: FunctionComponent<Props> = ({ className, isOpen, onClose }) => {
  const dispatch = useDispatch();
  const translate = useTranslate();
  const { showResultsInModal } = useAppLayout();
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

  const handleInsert = () => {
    if (resultCandidate) {
      dispatch(resultsSlice.actions.applyResult(resultCandidate));
    }

    onClose();
  };

  const handlePreview = () => {
    onClose();
  };

  useEffect(() => {
    if (isOpen && !showResultsInModal) {
      onClose();
    }
  }, [isOpen, onClose, showResultsInModal]);

  return (
    <Modal
      className={className}
      footer={
        <>
          <Button
            aria-label={translate('results.insert')}
            disabled={!resultCandidate}
            Icon={Check}
            tooltip={translate('results.insert')}
            variant="primary"
            onClick={handleInsert}
          >
            {translate('results.insert')}
          </Button>

          <Button
            aria-label={translate('results.preview')}
            disabled={!resultCandidate}
            Icon={EyeFill}
            tooltip={translate('results.preview')}
            onClick={handlePreview}
          >
            {translate('results.preview')}
          </Button>
        </>
      }
      isOpen={isOpen}
      title={translate('results')}
      onClose={onClose}
    >
      <div className={styles.content}>
        <Results callbacks={callbacks} className={styles.results} highlightedIndex={highlightedIndex} />
        <Dictionary className={styles.dictionary} />
      </div>
    </Modal>
  );
};

export const ResultsModal = memo(ResultsModalBase);
