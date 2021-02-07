import React, { useEffect } from 'react';
import { makeStyles } from '@material-ui/core';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../redux/store';
import { getChessTrapsThunk } from '../redux/chessTrapsSlice';
import DisplayChessTraps from '../components/DisplayChessTraps';

const ROOT_WIDTH = 1000;

const useStyles = makeStyles({
  root: {
    width: ROOT_WIDTH + 'px',
    margin: '0 auto',
  },
});

const ChessTrapsPage: React.FunctionComponent = () => {
  const dispatch = useDispatch();

  const classes = useStyles({});

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

  return (
    <div className={classes.root}>
      <DisplayChessTraps
        chessTraps={chessTrapsSlice.traps}
        parentWidth={ROOT_WIDTH}
        trapsPerRow={2}
      />
    </div>
  );
};

export default ChessTrapsPage;
