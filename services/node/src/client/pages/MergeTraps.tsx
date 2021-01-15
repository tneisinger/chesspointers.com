import React, { useEffect, useState } from 'react';
import { CardHeader, makeStyles } from '@material-ui/core';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import Grid from '@material-ui/core/Grid';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../redux/store';
import { getChessTrapsThunk } from '../redux/chessTrapsSlice';
import ChessGuide from '../components/ChessGuide';
import ChessTrapsSelector from '../components/ChessTrapsSelector';
import allChessTraps from '../../shared/chessTraps/index';
import { ChessTrap } from '../../shared/entity/chessTrap';
import { ChessTree, PieceColor } from '../../shared/chessTypes';
import { mergeTrees } from '../../shared/chessTree';

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

const MergeTrapsPage: React.FunctionComponent = () => {
  const dispatch = useDispatch();
  const chessTrapsSlice = useSelector((state: RootState) => state.chessTrapsSlice);
  const classes = useStyles({});

  useEffect(() => {
    if (chessTrapsSlice.requestStatus === 'NO_REQUEST_YET') {
      dispatch(getChessTrapsThunk());
    }
  }, []);

  const [selectedTraps, setSelectedTraps] = useState<ChessTrap[]>([]);
  const [userColor, setUserColor] = useState<PieceColor>('white');

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

  const mergeSelectedTraps = (): ChessTree => {
    return mergeTrees(...selectedTraps.map(t => t.chessTree));
  }

  return (
    <Grid item xs={12}>
      <Grid container direction='row' justify='center' spacing={2}>
        <Grid item>
          <Card className={classes.mainCard}>
            <CardContent>
              <Grid container direction='row' spacing={4}>
                <Grid item>
                  <ChessGuide
                    chessTree={mergeSelectedTraps()}
                    userPlaysAs={userColor}
                  />
                </Grid>
                <Grid item>
                  <ChessTrapsSelector
                    allChessTraps={allChessTraps}
                    setSelectedTraps={setSelectedTraps}
                    userColor={userColor}
                    setUserColor={setUserColor}
                  />
                </Grid>
              </Grid>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Grid>
  );
};

export default MergeTrapsPage;
