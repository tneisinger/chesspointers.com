import React from 'react';
import { Theme } from '@material-ui/core/styles';
import { useParams } from 'react-router-dom';
import { makeStyles } from '@material-ui/core';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import ChessGuide from '../components/ChessGuide';
import MovesPane from '../components/MovesPane';
import WithReduxSlice from '../components/WithReduxSlice';
import { getTrapsThunk } from '../redux/trapsSlice';
import { RootState } from '../redux/store';
import { TrapsSlice } from '../redux/trapsSlice';
import NotFoundPage from '../pages/NotFound';
import { toDashedLowercase } from '../../shared/utils';
import { calcChessBoardSize } from '../utils';
import { useWindowSize } from '../hooks/useWindowSize';

const useStyles = makeStyles((theme: Theme) => ({
  trapName: {
    textAlign: 'center',
    paddingTop: 0,
    paddingBottom: '1rem',
    marginBottom: '0',
    [theme.breakpoints.up('sm')]: {
      fontSize: '2.5rem',
    },
    [theme.breakpoints.down('sm')]: {
      fontSize: '1.6rem',
    },
  },
  trapRoot: {
    height: '100%',
    width: 'inherit',
    maxWidth: 'inherit',
  },
}));

const TrapPage: React.FunctionComponent = () => {
  return (
    <WithReduxSlice
      WrappedComponent={TrapPageContent}
      reduxThunk={getTrapsThunk}
      reduxSelector={(state: RootState) => state.trapsSlice}
    />
  );
};

const TrapPageContent: React.FC<TrapsSlice> = ({ traps }) => {
  const classes = useStyles({});
  const { windowWidth, windowHeight } = useWindowSize();
  const { trapName } = useParams<{ trapName: string }>();

  let boardSizePixels;
  if (windowWidth > windowHeight) {
    boardSizePixels = calcChessBoardSize(70, 'vh');
  } else {
    boardSizePixels = calcChessBoardSize(91, 'vw');
  }

  // Find the trap with a name that matches the trapName param
  const trap = traps.find((t) => toDashedLowercase(t.shortName) === trapName);

  // If `trap` is undefined, that means that the trapName param didn't match the name of
  // any of the traps in the db. In that case, treat it as not found.
  if (trap === undefined) {
    return <NotFoundPage />;
  }

  return (
    <Grid
      container
      className={classes.trapRoot}
      direction='column'
      alignItems='center'
      justify='center'
    >
      <Grid item>
        <Typography className={classes.trapName} variant='h4' component='h2'>
          {trap.fullName}
        </Typography>
      </Grid>
      <Grid item>
        <Grid container direction='row' spacing={2}>
          <Grid item>
            <ChessGuide
              chessTree={trap.chessTree}
              lessonType={trap.lessonType}
              userPlaysAs={trap.playedByWhite ? 'white' : 'black'}
              boardSizePixels={boardSizePixels}
            >
              {windowWidth > 1000 && (
                <MovesPane
                  height={boardSizePixels}
                  playedMoves={[]}
                  selectedMoveIdx={null}
                  changeSelectedMoveIdx={(idx) => void idx}
                />
              )}
            </ChessGuide>
          </Grid>
        </Grid>
      </Grid>
    </Grid>
  );
};

export default TrapPage;
