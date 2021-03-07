import React, { useEffect, useState, useCallback } from 'react';
import { makeStyles } from '@material-ui/core';
import Card from '@material-ui/core/Card';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../redux/store';
import { getTrapsThunk } from '../redux/chessTrapsSlice';
import ChessGuide from '../components/ChessGuide';
import SelectTrapsPane from '../components/SelectTrapsPane';
import MovesPane from '../components/MovesPane';
import { Trap } from '../../shared/entity/chessTrap';
import { ChessTree, PieceColor } from '../../shared/chessTypes';
import { mergeTrees } from '../../shared/chessTree';
import { calcChessBoardSize } from '../utils';

const useStyles = makeStyles(() => ({
  mainCard: {
    padding: '32px',
  },
  pageTitle: {
    textAlign: 'center',
    paddingTop: 0,
    paddingBottom: '1rem',
    marginBottom: '0',
  },
}));

const MergeTrapsPage: React.FunctionComponent = () => {
  const dispatch = useDispatch();
  const chessTrapsSlice = useSelector((state: RootState) => state.chessTrapsSlice);
  const classes = useStyles({});

  const [selectedTraps, setSelectedTraps] = useState<Trap[]>([]);
  const [userColor, setUserColor] = useState<PieceColor>('white');
  const [chessGuideWrapperHeight, setChessGuideWrapperHeight] = useState(0);

  const chessGuideWrapperRef = useCallback((chessGuideWrapper) => {
    if (chessGuideWrapper != null) {
      const style = getComputedStyle(chessGuideWrapper, null);
      let height = chessGuideWrapper.clientHeight;
      height -= parseFloat(style.paddingTop) + parseFloat(style.paddingBottom);
      setChessGuideWrapperHeight(height);
    }
  }, []);

  useEffect(() => {
    if (chessTrapsSlice.requestStatus === 'NO_REQUEST_YET') {
      dispatch(getTrapsThunk());
    }
  }, []);

  if (chessTrapsSlice.requestStatus === 'ERROR') {
    return <p>An error occurred: {chessTrapsSlice.error}</p>;
  }

  if (chessTrapsSlice.requestStatus !== 'LOADED') {
    return <p>Loading...</p>;
  }

  const mergeSelectedTraps = (): ChessTree => {
    return mergeTrees(...selectedTraps.map((t) => t.chessTree));
  };

  const boardSize = calcChessBoardSize(70, 'vh');

  const heightOfRightSidePanes = chessGuideWrapperHeight / 2 - 20;

  return (
    <Grid container direction='row' justify='center'>
      <Grid item>
        <Typography className={classes.pageTitle} variant='h4' component='h2'>
          Merge Traps
        </Typography>
        <Card className={classes.mainCard}>
          <div ref={chessGuideWrapperRef}>
            <ChessGuide
              chessTree={mergeSelectedTraps()}
              userPlaysAs={userColor}
              boardSizePixels={boardSize}
            >
              <SelectTrapsPane
                height={heightOfRightSidePanes}
                selectedTraps={selectedTraps}
                setSelectedTraps={setSelectedTraps}
                userColor={userColor}
                setUserColor={setUserColor}
              />
              <MovesPane
                height={heightOfRightSidePanes}
                playedMoves={[]}
                selectedMoveIdx={null}
                changeSelectedMoveIdx={(idx) => void idx}
              />
            </ChessGuide>
          </div>
        </Card>
      </Grid>
    </Grid>
  );
};

export default MergeTrapsPage;
