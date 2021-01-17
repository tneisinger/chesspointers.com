import React from 'react';
import { makeStyles } from '@material-ui/core';
import TableCell from '@material-ui/core/TableCell';
import TableRow from '@material-ui/core/TableRow';
import { MovePair } from '../../shared/chessTypes';

const useStyles = makeStyles((theme) => ({
  tableRow: {
    '&:nth-child(even)': {
      backgroundColor: theme.palette.action.hover,
    }
  },
  tableCell: {
    padding: '4px 16px',
  }
}));

interface Props {
  movePair: MovePair;
  moveNumber: number;

}

const MovesTableRow: React.FC<Props> = ({
  movePair,
  moveNumber,
}) => {

  const classes = useStyles();

  return (
    <TableRow className={classes.tableRow}>
      <TableCell className={classes.tableCell}>{moveNumber}.</TableCell>
      <TableCell className={classes.tableCell}>{movePair.whiteMove}</TableCell>
      <TableCell className={classes.tableCell}>
        { movePair.blackMove != undefined &&
          movePair.blackMove
        }
      </TableCell>
    </TableRow>
  );
}

export default MovesTableRow;
