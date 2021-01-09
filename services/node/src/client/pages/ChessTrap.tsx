import React, { useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { CardHeader, makeStyles } from '@material-ui/core';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import Grid from '@material-ui/core/Grid';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../redux/store';
import { getChessTrapsThunk } from '../redux/chessTrapsSlice';
import ChessGuide from '../components/ChessGuide';
import NotFoundPage from "../pages/NotFound";

const useStyles = makeStyles(() => ({
  mainCard: {
    padding: '0 40px',
  },
  cardHeader: {
    textAlign: 'center',
    paddingBottom: '0',
    marginBottom: '0',
  },
}));

const ChessTrapPage: React.FunctionComponent = () => {
  const dispatch = useDispatch();
  const chessTrapsSlice = useSelector((state: RootState) => state.chessTrapsSlice);
  const classes = useStyles({});

  const { trapId } = useParams<{ trapId: string }>();

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

  // Find the trap that matches the trapId param
  const trap = chessTrapsSlice.traps.find(t => String(t.id) === trapId);

  // If `trap` is undefined, that means that the trapId param didn't match an id of
  // any of the traps in the db. In that case, treat it as not found.
  if (trap === undefined) {
    return <NotFoundPage />
  }

  return (
    <Grid item xs={12}>
      <Grid container direction='row' justify='center' spacing={2}>
        <Grid item>
          <Card className={classes.mainCard}>
            <CardHeader className={classes.cardHeader} title={`The ${trap.name} Trap`} />
            <CardContent>
              <ChessGuide
                chessTree={trap.chessTree}
                userPlaysAs={trap.playedByWhite ? 'white' : 'black'}
              />
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Grid>
  );
};

export default ChessTrapPage;

