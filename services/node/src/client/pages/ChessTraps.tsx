import React, { useEffect } from 'react';
import { Theme } from '@material-ui/core/styles';
import { makeStyles } from '@material-ui/core';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../redux/store';
import { getChessTrapsThunk } from '../redux/chessTrapsSlice';
import DisplayChessTraps from '../components/DisplayChessTraps';
import useDimensions from 'react-use-dimensions';

const useStyles = makeStyles((theme: Theme) => ({
  titleText: {
    [theme.breakpoints.up('sm')]: {
      fontSize: '3rem',
    },
    [theme.breakpoints.down('sm')]: {
      fontSize: '1.75rem',
    },
  },
  chessTrapsRoot: {
    maxWidth: 'inherit',
    width: 'inherit',
    height: '100%',
  },
}));

const ChessTrapsPage: React.FunctionComponent = () => {
  const dispatch = useDispatch();

  const classes = useStyles();

  const [rootDivRef, rootDivDimensions] = useDimensions();

  const chessTrapsSlice = useSelector((state: RootState) => state.chessTrapsSlice);

  useEffect(() => {
    if (chessTrapsSlice.requestStatus === 'NO_REQUEST_YET') {
      dispatch(getChessTrapsThunk());
    }
  }, []);

  if (chessTrapsSlice.requestStatus === 'ERROR') {
    return <p>An error occurred: {chessTrapsSlice.error}</p>;
  }

  if (chessTrapsSlice.requestStatus !== 'LOADED') {
    return <p>Loading...</p>;
  }

  const trapsPerRow = 1;

  return (
    <div className={classes.chessTrapsRoot} ref={rootDivRef}>
      <DisplayChessTraps
        chessTraps={chessTrapsSlice.traps}
        parentWidth={rootDivDimensions.width}
        trapsPerRow={trapsPerRow}
      />
    </div>
  );
};

export default ChessTrapsPage;
