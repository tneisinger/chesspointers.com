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
  lessonName: {
    textAlign: 'center',
    paddingTop: 0,
    paddingBottom: '0.75rem',
    marginBottom: '0',
    [theme.breakpoints.up('sm')]: {
      fontSize: '2.5rem',
    },
    [theme.breakpoints.down('sm')]: {
      fontSize: '1.6rem',
    },
  },
  lessonRoot: {
    height: '100%',
    width: 'inherit',
    maxWidth: 'inherit',
    overflow: 'hidden',
  },
  attribution: {
    fontSize: '0.8rem',
    textDecoration: 'underline',
    marginBottom: '10px',
  },
}));

interface Props<Slice extends EntitiesSlice<Lesson>> {
  reduxThunk: () => AppThunk;
  reduxSelector: (state: RootState) => Slice;
}

const LessonPage = <S extends EntitiesSlice<Lesson>>(props: Props<S>): ReactElement => {
  return <WithReduxSlice WrappedComponent={LessonPageContent as any} {...props} />;
};

const LessonPageContent: React.FC<EntitiesSlice<Lesson>> = ({ entities }) => {
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
  const lesson = entities.find((t) => toDashedLowercase(t.shortName) === lessonName);

  // If `lesson` is undefined, that means that the lessonName param didn't match the
  // name of any of the lessons in the db. In that case, treat it as not found.
  if (lesson === undefined) {
    return <NotFoundPage />;
  }

  return (
    <Grid
      container
      className={classes.lessonRoot}
      direction='column'
      alignItems='center'
      justify='center'
    >
      <Grid item>
        <Typography className={classes.lessonName} variant='h4' component='h2'>
          {lesson.fullName}
        </Typography>
      </Grid>
      {lesson.attribution != null && (
        <Grid item>
          <Typography className={classes.attribution}>
            <a rel='noopener noreferrer' target='_blank' href={lesson.attribution.url}>
              {lesson.attribution.text}
            </a>
          </Typography>
        </Grid>
      )}
      <Grid item>
        <Grid container direction='row' spacing={2}>
          <Grid item>
            <ChessGuide
              chessTree={lesson.chessTree}
              lessonType={lesson.lessonType}
              userPlaysAs={lesson.playedByWhite ? 'white' : 'black'}
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
