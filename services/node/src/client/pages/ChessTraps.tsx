import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../redux/store';
import { getChessTrapsThunk } from '../redux/chessTrapsSlice';
import Grid from '@material-ui/core/Grid';
import DisplayChessTraps from '../components/DisplayChessTraps';

const ChessTrapsPage: React.FunctionComponent = () => {
  const dispatch = useDispatch();

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
    <Grid container justify='center'>
      <Grid item xs={7}>
        <DisplayChessTraps chessTraps={chessTrapsSlice.traps} />
      </Grid>
    </Grid>
  );
};

export default ChessTrapsPage;
