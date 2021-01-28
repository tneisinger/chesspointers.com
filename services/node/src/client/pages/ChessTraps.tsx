import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../redux/store';
import { getChessTrapsThunk } from '../redux/chessTrapsSlice';
import Grid from '@material-ui/core/Grid';
import DisplayChessTraps from '../components/DisplayChessTraps';
import ChessTrapFilters from '../components/ChessTrapFilters';
import { ChessTrap } from '../../shared/entity/chessTrap';

const ChessTrapsPage: React.FunctionComponent = () => {
  const dispatch = useDispatch();

  const chessTrapsSlice = useSelector((state: RootState) => state.chessTrapsSlice);

  const [visibleTraps, setVisibleTraps] = useState<ChessTrap[]>(chessTrapsSlice.traps);

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
    <Grid container direction='row' justify='center'>
      <Grid item xs={3}>
        <ChessTrapFilters
          allTraps={chessTrapsSlice.traps}
          setSelectedTraps={setVisibleTraps}
        />
      </Grid>
      <Grid item xs={9}>
        <DisplayChessTraps chessTraps={visibleTraps} />
      </Grid>
    </Grid>
  );
};

export default ChessTrapsPage;
