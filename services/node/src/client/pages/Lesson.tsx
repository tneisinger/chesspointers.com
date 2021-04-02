import React, { ReactElement } from 'react';
import { Theme } from '@material-ui/core/styles';
import { useParams } from 'react-router-dom';
import { makeStyles } from '@material-ui/core';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import ChessGuide from '../components/ChessGuide';
import MovesPane from '../components/MovesPane';
import WithReduxSlice from '../components/WithReduxSlice';
import { RootState } from '../redux/store';
import { EntitiesSlice } from '../redux/types';
import NotFoundPage from '../pages/NotFound';
import { toDashedLowercase } from '../../shared/utils';
import { calcChessBoardSize } from '../utils';
import { useWindowSize } from '../hooks/useWindowSize';
import AppThunk from '../redux/appThunk';
import { Lesson } from '../../shared/entity/lesson';

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

interface Props<Slice extends EntitiesSlice<Lesson>> {
  reduxThunk: () => AppThunk;
  reduxSelector: (state: RootState) => Slice;
}

const LessonPage = <S extends EntitiesSlice<Lesson>>(props: Props<S>): ReactElement => {
  return <WithReduxSlice WrappedComponent={OpeningPageContent as any} {...props} />;
};

const OpeningPageContent: React.FC<EntitiesSlice<Lesson>> = ({ entities }) => {
  const classes = useStyles({});
  const { windowWidth, windowHeight } = useWindowSize();
  const { lessonName } = useParams<{ lessonName: string }>();

  let boardSizePixels: number;
  if (windowWidth > windowHeight) {
    boardSizePixels = calcChessBoardSize(70, 'vh');
  } else {
    boardSizePixels = calcChessBoardSize(91, 'vw');
  }

  // Find the lesson with a name that matches the lessonName param
  const opening = entities.find((t) => toDashedLowercase(t.shortName) === lessonName);

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

export default LessonPage;
