import React, { useState, useCallback } from 'react';
import { makeStyles } from '@material-ui/core';
import Card from '@material-ui/core/Card';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import { RootState } from '../redux/store';
import { getTrapsThunk, TrapsSlice } from '../redux/trapsSlice';
import ChessGuide from '../components/ChessGuide';
import SelectTrapsPane from '../components/SelectTrapsPane';
import MovesPane from '../components/MovesPane';
import WithReduxSlice from '../components/WithReduxSlice';
import { Lesson } from '../../shared/entity/lesson';
import { ChessTree, PieceColor } from '../../shared/chessTypes';
import { mergeTrees } from '../../shared/chessTree';
import { calcChessBoardSize } from '../utils';
import { LessonType } from '../../shared/entity/lesson';

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

const MergeTrapsPageContent: React.FC<TrapsSlice> = () => {
  const classes = useStyles({});

  const [selectedTraps, setSelectedTraps] = useState<Lesson[]>([]);
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
              lessonType={LessonType.TRAP}
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

const MergeTrapsPage: React.FunctionComponent = () => (
  <WithReduxSlice
    WrappedComponent={MergeTrapsPageContent}
    reduxThunk={getTrapsThunk}
    reduxSelector={(state: RootState) => state.trapsSlice}
  />
);

export default MergeTrapsPage;
