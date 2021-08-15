import React from 'react';
import { Theme } from '@material-ui/core/styles';
import { useParams } from 'react-router-dom';
import { makeStyles } from '@material-ui/core';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import ChessGuide from '../components/ChessGuide';
import MovesPane from '../components/MovesPane';
import NotFoundPage from '../pages/NotFound';
import { calcChessBoardSize } from '../utils';
import { useWindowSize } from '../hooks/useWindowSize';
import { LessonType } from '../../shared/entity/lesson';
import { useUserLessons } from '../hooks/useUserLessons';
import { makeChessTreeFromPGNString } from '../../shared/pgnToChessTree';

const useStyles = makeStyles((theme: Theme) => ({
  lessonName: {
    textAlign: 'center',
    paddingTop: 0,
    paddingBottom: '0.75rem',
    marginBottom: '0',
    [theme.breakpoints.up('md')]: {
      fontSize: '2.25rem',
    },
    [theme.breakpoints.between('sm', 'md')]: {
      fontSize: '1.8rem',
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

const UserLessonPage: React.FC = () => {
  const classes = useStyles({});
  const { windowWidth, windowHeight } = useWindowSize();
  const { lessonName } = useParams<{ lessonName: string }>();

  let boardSizePixels: number;
  if (windowWidth > windowHeight) {
    boardSizePixels = calcChessBoardSize(67, 'vh');
  } else {
    boardSizePixels = calcChessBoardSize(91, 'vw');
  }

  const { userLessons } = useUserLessons();

  if (userLessons[lessonName] == undefined) {
    return <NotFoundPage />;
  }

  const chessTree = makeChessTreeFromPGNString(userLessons[lessonName].pgnString);

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
          "{lessonName}"
        </Typography>
      </Grid>
      <Grid item>
        <Grid container direction='row' spacing={2}>
          <Grid item>
            <ChessGuide
              chessTree={chessTree}
              lessonType={LessonType.OPENING}
              userPlaysAs={userLessons[lessonName].playAs}
              boardSizePixels={boardSizePixels}
            >
              {windowWidth > 960 && (
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

export default UserLessonPage;
