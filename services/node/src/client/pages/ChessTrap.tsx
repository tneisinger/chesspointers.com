import React, { useEffect, useState, useCallback } from 'react';
import { useParams } from 'react-router-dom';
import { makeStyles } from '@material-ui/core';
import Card from '@material-ui/core/Card';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../redux/store';
import { getChessTrapsThunk } from '../redux/chessTrapsSlice';
import ChessGuide from '../components/ChessGuide';
import MovesPane from '../components/MovesPane';
import NotFoundPage from '../pages/NotFound';
import { toDashedLowercase } from '../../shared/utils';
import { formatTrapName } from '../../shared/chessTraps/index';
import { calcChessBoardSize } from '../utils';

const useStyles = makeStyles(() => ({
  mainCard: {
    padding: '32px',
  },
  gridItem: {
    paddingTop: '0px!important',
    paddingBottom: '0px!important',
  },
  trapName: {
    textAlign: 'center',
    paddingTop: 0,
    paddingBottom: '1rem',
    marginBottom: '0',
  },
}));

const ChessTrapPage: React.FunctionComponent = () => {
  const boardSizePixels = calcChessBoardSize(70, 'vh');

  const [containerHeight, setContainerHeight] = useState<number>(boardSizePixels)
  const dispatch = useDispatch();
  const chessTrapsSlice = useSelector((state: RootState) => state.chessTrapsSlice);
  const classes = useStyles({});

  const gridContainerRef = useCallback(card => {
    if (card != null) {
      setContainerHeight(card.clientHeight)
    }
  }, []);

  const { trapName } = useParams<{ trapName: string }>();

  useEffect(() => {
    if (chessTrapsSlice.requestStatus === 'NO_REQUEST_YET') {
      dispatch(getChessTrapsThunk());
    }
  }, []);

  if (chessTrapsSlice.requestStatus === 'ERROR') {
    return (
      <p>An error occurred: {chessTrapsSlice.error}</p>
    );
  }

  if (chessTrapsSlice.requestStatus !== 'LOADED') {
    return (
      <p>Loading...</p>
    );
  }

  // Find the trap with a name that matches the trapName param
  const trap = chessTrapsSlice.traps.find(
    t => toDashedLowercase(t.name) === trapName
  );

  // If `trap` is undefined, that means that the trapName param didn't match the name of
  // any of the traps in the db. In that case, treat it as not found.
  if (trap === undefined) {
    return <NotFoundPage />
  }

  return (
    <Grid container direction='row' justify='center'>
      <Grid item className={classes.gridItem}>
        <Typography className={classes.trapName} variant='h4' component='h2'>
          {formatTrapName(trap)}
        </Typography>
        <Card className={classes.mainCard}>
          <Grid container ref={gridContainerRef} direction='row' spacing={2}>
            <Grid item className={classes.gridItem}>
              <ChessGuide
                chessTree={trap.chessTree}
                userPlaysAs={trap.playedByWhite ? 'white' : 'black'}
                boardSizePixels={boardSizePixels}
              />
            </Grid>
          </Grid>
        </Card>
      </Grid>
    </Grid>
  );
};

export default ChessTrapPage;
