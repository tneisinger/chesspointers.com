import React from 'react';
import { makeStyles } from '@material-ui/core';
import TableCell from '@material-ui/core/TableCell';
import TableRow from '@material-ui/core/TableRow';
import { MovePair } from '../../shared/chessTypes';

const useStyles = makeStyles((theme) => ({
  tableRow: {
    '&:nth-child(even)': {
      backgroundColor: theme.palette.action.hover,
    },
  },
  numberCell: {
    padding: '1rem 0 1rem 1rem',
    width: '20%',
  },
  moveCell: {
    padding: '1rem 0 1rem 1rem',
    width: '40%',
  },
  move: {
    padding: '0.25rem 0.5rem',
    borderRadius: '4px',
    backgroundColor: 'transparent',
    color: theme.palette.text.primary,
    border: 'none',
    cursor: 'pointer',
    '&:focus': {
      outline: 0,
    },
  },
  selectedMove: {
    backgroundColor: theme.palette.action.selected,
  },
}));

interface Props {
  movePair: MovePair;
  moveNumber: number;
  selectedMoveIdx: number | null;
  changeSelectedMoveIdx: (idx: number) => void;
}

const MovesTableRow: React.FC<Props> = (props) => {
  const classes = useStyles();

  const isWhiteMoveSelected = (): boolean => {
    return props.selectedMoveIdx === 2 * props.moveNumber - 2;
  };

  const isBlackMoveSelected = (): boolean => {
    return props.selectedMoveIdx === 2 * props.moveNumber - 1;
  };

  const moveClasses = (isSelected: boolean): string => {
    if (isSelected) return `${classes.move} ${classes.selectedMove}`;
    return classes.move;
  };

  const handleWhiteMoveClick = (): void => {
    props.changeSelectedMoveIdx(props.moveNumber * 2 - 2);
  };

  const handleBlackMoveClick = (): void => {
    props.changeSelectedMoveIdx(props.moveNumber * 2 - 1);
  };

  return (
    <TableRow className={classes.tableRow}>
      <TableCell className={classes.numberCell}>{props.moveNumber}.</TableCell>
      <TableCell className={classes.moveCell}>
        <button
          className={moveClasses(isWhiteMoveSelected())}
          onClick={handleWhiteMoveClick}
        >
          {props.movePair.whiteMove}
        </button>
      </TableCell>
      <TableCell className={classes.moveCell}>
        <button
          className={moveClasses(isBlackMoveSelected())}
          onClick={handleBlackMoveClick}
        >
          {props.movePair.blackMove != undefined && props.movePair.blackMove}
        </button>
      </TableCell>
    </TableRow>
  );
};

export default MovesTableRow;
