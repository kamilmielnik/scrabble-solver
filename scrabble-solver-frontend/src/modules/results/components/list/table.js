import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { applyResult } from 'shared/state';
import { highlightResult } from 'results/state';
import { selectFormattedResults } from 'results/selectors';
import Table, { Column } from 'react-virtualized/dist/commonjs/Table';
import NoResults from 'components/no-results';
import HeaderCell from './header-cell';
import styles from './results-list.module.scss';

const COLUMNS = [
  { label: 'modules.results.list.points', dataKey: 'points', width: 66 },
  { label: 'modules.results.list.points-ratio', dataKey: 'pointsRatio', width: 66 },
  { label: 'modules.results.list.word', dataKey: 'word', width: 130 },
  { label: 'modules.results.list.length', dataKey: 'length', width: 75 },
  { label: 'modules.results.list.tiles', dataKey: 'tilesCharacters', width: 80 },
  { label: 'modules.results.list.number-of-tiles', dataKey: 'numberOfTiles', width: 66 },
  { label: 'modules.results.list.number-of-blanks', dataKey: 'numberOfBlanks', width: 71 },
  { label: 'modules.results.list.number-of-collisions', dataKey: 'numberOfCollisions', width: 91 }
];

const ResultsTable = ({ results, onRowClick, onRowMouseOver }) => (
  <Table
    gridClassName={styles.grid}
    headerClassName={styles.headerCell}
    width={645}
    height={701}
    headerHeight={20}
    rowHeight={23}
    rowCount={results.length}
    rowGetter={({ index }) => results[index]}
    noRowsRenderer={() => (
      <NoResults />
    )}
    rowClassName={({ index }) => index === -1 ? styles.headerRow : styles.row}
    onRowClick={onRowClick}
    onRowMouseOver={onRowMouseOver}>
    {COLUMNS.map((column, index) => (
      <Column
        {...column}
        className={styles.cell}
        headerRenderer={(header) => (
          <HeaderCell {...header} />
        )}
        key={index} />
    ))}
  </Table>
);

ResultsTable.propTypes = {
  results: PropTypes.array.isRequired,
  onRowClick: PropTypes.func.isRequired,
  onRowMouseOver: PropTypes.func.isRequired
};

const mapStateToProps = (state) => ({
  results: selectFormattedResults(state)
});

const mapDispatchToProps = (dispatch) => ({
  onRowClick: ({ rowData: { id } }) => dispatch(applyResult(id)),
  onRowMouseOver: ({ rowData: { id } }) => dispatch(highlightResult(id))
});

export default connect(mapStateToProps, mapDispatchToProps)(ResultsTable);
