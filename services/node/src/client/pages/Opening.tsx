import React from 'react';
import { Theme } from '@material-ui/core/styles';
import { useParams } from 'react-router-dom';
import { makeStyles } from '@material-ui/core';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import ChessGuide from '../components/ChessGuide';
import MovesPane from '../components/MovesPane';
import WithReduxSlice from '../components/WithReduxSlice';
import { getOpeningsThunk } from '../redux/openingsSlice';
import { RootState } from '../redux/store';
import { OpeningsSlice } from '../redux/openingsSlice';
import NotFoundPage from '../pages/NotFound';
import { toDashedLowercase } from '../../shared/utils';
import { calcChessBoardSize } from '../utils';
import { useWindowSize } from '../hooks/useWindowSize';

const useStyles = makeStyles((theme: Theme) => ({
  openingName: {
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
  openingRoot: {
    height: '100%',
    width: 'inherit',
    maxWidth: 'inherit',
  },
}));

const OpeningPage: React.FunctionComponent = () => {
  return (
    <WithReduxSlice
      WrappedComponent={OpeningPageContent}
      reduxThunk={getOpeningsThunk}
      reduxSelector={(state: RootState) => state.openingsSlice}
    />
  );
};

const OpeningPageContent: React.FC<OpeningsSlice> = ({ openings }) => {
  const classes = useStyles({});
  const { windowWidth, windowHeight } = useWindowSize();
  const { openingName } = useParams<{ openingName: string }>();

  let boardSizePixels: number;
  if (windowWidth > windowHeight) {
    boardSizePixels = calcChessBoardSize(70, 'vh');
  } else {
    boardSizePixels = calcChessBoardSize(91, 'vw');
  }

  // Find the opening with a name that matches the openingName param
  const opening = openings.find((t) => toDashedLowercase(t.shortName) === openingName);

  // If `opening` is undefined, that means that the openingName param didn't match the
  // name of any of the openings in the db. In that case, treat it as not found.
  if (opening === undefined) {
    return <NotFoundPage />;
  }

  return (
    <Grid
      container
      className={classes.openingRoot}
      direction='column'
      alignItems='center'
      justify='center'
    >
      <Grid item>
        <Typography className={classes.openingName} variant='h4' component='h2'>
          {opening.fullName}
        </Typography>
      </Grid>
      <Grid item>
        <Grid container direction='row' spacing={2}>
          <Grid item>
            <ChessGuide
              chessTree={opening.chessTree}
              lessonType={opening.lessonType}
              userPlaysAs={opening.playedByWhite ? 'white' : 'black'}
              boardSizePixels={boardSizePixels}
            >
              {windowWidth > 1280 && (
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

export default OpeningPage;
