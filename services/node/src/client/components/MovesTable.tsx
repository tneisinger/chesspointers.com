import React from 'react';
import { makeStyles } from '@material-ui/core';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import { MovePair } from '../../shared/chessTypes';
import MovesTableRow from './MovesTableRow';

const useStyles = makeStyles(() => ({
  table: {
    tableLayout: 'fixed',
  }
}));

interface Props {
  moves: string[];
}

const MovesTable: React.FunctionComponent<Props> = ({
  moves,
}) => {

  const classes = useStyles();

  const makeMovePairs = (): MovePair[] => (
    moves.reduce((acc: MovePair[], move, idx) => {
      if (idx % 2 === 0) {
        const blackMove = moves[idx + 1];
        if (blackMove == undefined) return [...acc, { whiteMove: move }];
        return [...acc, { whiteMove: move, blackMove }];
      }
      return acc;
    }, [])
  )

  return (
    <>
      <Table className={classes.table} aria-label="table of chess moves">
        <TableBody>
        {
          makeMovePairs().map((pair, idx) => (
            <MovesTableRow
              key={idx + pair.whiteMove}
              movePair={pair}
              moveNumber={idx + 1}
            />
          ))
        }
        </TableBody>
      </Table>
    </>
  );
};

export default MovesTable;
