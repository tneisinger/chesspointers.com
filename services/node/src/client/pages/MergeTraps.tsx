import React, { useEffect, useState } from 'react';
import { makeStyles } from '@material-ui/core';
import Card from '@material-ui/core/Card';
import Grid from '@material-ui/core/Grid';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../redux/store';
import { getChessTrapsThunk } from '../redux/chessTrapsSlice';
import ChessGuide from '../components/ChessGuide';
import SelectTrapsPane from '../components/SelectTrapsPane';
import MovesPane from '../components/MovesPane';
import { ChessTrap } from '../../shared/entity/chessTrap';
import { ChessTree, PieceColor } from '../../shared/chessTypes';
import { mergeTrees } from '../../shared/chessTree';
import { calcChessBoardSize } from '../utils';

const useStyles = makeStyles(() => ({
  mainCard: {
    padding: '32px',
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
  const [selectedTraps, setSelectedTraps] = useState<ChessTrap[]>([]);
  const [userColor, setUserColor] = useState<PieceColor>('white');

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

  const mergeSelectedTraps = (): ChessTree => {
    return mergeTrees(...selectedTraps.map(t => t.chessTree));
  }

  return (
    <Grid item xs={12}>
      <Grid container direction='row' justify='center'>
        <Card className={classes.mainCard}>
          <Grid container direction='row' spacing={4}>
            <Grid item>
              <ChessGuide
                chessTree={mergeSelectedTraps()}
                userPlaysAs={userColor}
                boardSizePixels={calcChessBoardSize(70, 'vh')}
              >
                <SelectTrapsPane
                  height={300}
                  setSelectedTraps={setSelectedTraps}
                  userColor={userColor}
                  setUserColor={setUserColor}
                />
                <MovesPane height={300} playedMoves={[]} />
              </ChessGuide>
            </Grid>
          </Grid>
        </Card>
      </Grid>
    </Grid>
  );
};

export default MergeTrapsPage;
