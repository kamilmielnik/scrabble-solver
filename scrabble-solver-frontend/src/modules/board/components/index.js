import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { selectRowsWithCandidate } from 'board/selectors';
import Section from 'components/section';
import { Message } from 'i18n/components';
import Row from './row';
import styles from './board.module.scss';

const Board = ({ className, rows }) => (
  <Section
    className={className}
    id="board"
    label={(
      <Message id="modules.board.label" />
    )}>
    <div className={styles.board}>
      {rows.map((cells, index) => (
        <Row key={index} cells={cells} />
      ))}
    </div>
  </Section>
);

Board.propTypes = {
  className: PropTypes.string,
  rows: PropTypes.array.isRequired
};

const mapStateToProps = (state) => ({
  rows: selectRowsWithCandidate(state)
});

export default connect(mapStateToProps)(Board);
