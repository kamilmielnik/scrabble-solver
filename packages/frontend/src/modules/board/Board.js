import React from 'react';

import { useRows } from './hooks';
import Row from './Row';
import styles from './Board.module.scss';

const Board = () => {
  const rows = useRows();

  return (
    <div className={styles.board}>
      {rows.map((cells, index) => (
        <Row key={index} cells={cells} />
      ))}
    </div>
  );
};

export default Board;
