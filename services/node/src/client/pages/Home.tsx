import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useHistory, Link } from 'react-router-dom';
import { makeStyles } from '@material-ui/core';
import { Theme } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import Grid from '@material-ui/core/Grid';
import Button from '@material-ui/core/Button';
import { Lesson, LessonType } from '../../shared/entity/lesson';
import { getLessonUrlPath } from '../../shared/lessons';
import { getOpeningsThunk } from '../redux/openingsSlice';
import { getTrapsThunk } from '../redux/trapsSlice';
import { RootState } from '../redux/store';
import { assertUnreachable, randomElem } from '../../shared/utils';
import ChessTreePreview from '../components/ChessTreePreview';
import Spinner from '../components/Spinner';
import { useStepper } from '../hooks/useStepper';
import { getViewportWidth, getViewportHeight } from '../utils';
import metadata from '../../shared/metadata.json';

const BOARD_SIZE_VW = 0.8;  // percentage of viewport width
const BOARD_SIZE_VH = 0.55;  // percentage of viewport height

const useStyles = makeStyles((theme: Theme) => ({
  homepageRoot: {
    height: '100%',
    padding: '20px 20px 10px 20px',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-around',
    alignItems: 'center',
  },
  heading: {
    [theme.breakpoints.up('md')]: {
      fontSize: '3rem',
    },
  },
  chessBoardDiv: {
    margin: '20px',
  },
  chessBoardLink: {
    textDecoration: 'none',
    '&:hover': {
      textDecoration: 'none',
    }
  },
  chessBoardTitle: {
    fontWeight: 'normal',
    marginTop: '2px',
  },
  buttonsDiv: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '70vw',
    maxWidth: '375px',
    margin: '20px',
  },
  infoParagraph: {
    fontSize: '1.25rem',
    marginBottom: '8px',
    textAlign: 'center',
  },
}));

const HomePage: React.FunctionComponent = () => {
  const classes = useStyles({});

  const history = useHistory();

  const dispatch = useDispatch();
  const openingsSlice = useSelector((state: RootState) => state.openingsSlice);
  const trapsSlice = useSelector((state: RootState) => state.trapsSlice);

  const { stepperValue } = useStepper({ startValue: 0 });

  const makeApiRequest = (lessonType: LessonType) => {
  // Make a redux request for the lessons of that type
    switch(lessonType) {
      case LessonType.OPENING:
        dispatch(getOpeningsThunk());
        break;
      case LessonType.TRAP:
        dispatch(getTrapsThunk());
        break;
      default:
        assertUnreachable(lessonType);
    }
  };

  // Select a random lessonType
  const [randomLessonType] = useState<LessonType>(
    randomElem(Object.values(LessonType)) as any
  );

  const [randomLesson, setRandomLesson] = useState<Lesson | undefined>(undefined);

  useEffect(() => {
    makeApiRequest(randomLessonType);
  }, [randomLessonType]);

  useEffect(() => {
    if (randomLessonType === LessonType.OPENING && openingsSlice.entities.length > 0) {
      setRandomLesson(randomElem(openingsSlice.entities));
    } else if (randomLessonType === LessonType.TRAP && trapsSlice.entities.length > 0) {
      setRandomLesson(randomElem(trapsSlice.entities));
    }
  }, [openingsSlice, trapsSlice, randomLessonType]);

  const vpWidth = getViewportWidth();
  const boardSize =
    Math.min(vpWidth * BOARD_SIZE_VW, getViewportHeight() * BOARD_SIZE_VH);

  const getButtonSize = (): 'small' | 'medium' | 'large' => (
    vpWidth > 500 ? 'large' : 'small'
  );

  return (
    <Grid className={classes.homepageRoot} item xs={12}>
      <Typography
        className={classes.heading}
        variant='h4'
        component='h2'
        align='center'
      >
        Improve at Chess
      </Typography>
      <div className={classes.buttonsDiv}>
        <Button
          onClick={() => history.push('/openings')}
          size={getButtonSize()}
          variant='contained'
          color='primary'
          component='h3'
        >
            Learn Openings
        </Button>
        <Button
          onClick={() => history.push('/traps')}
          size={getButtonSize()}
          variant='contained'
          color='primary'
          component='h3'
        >
            Learn Traps
        </Button>
      </div>
      <div className={classes.chessBoardDiv}>
        <ChessTreePreviewOrSpinner
          lesson={randomLesson}
          stepper={stepperValue}
          boardSize={boardSize}
        />
      </div>
      <div>
        <Typography align='center'>
          This site is a work-in-progress.
        </Typography>
        <Typography align='center'>
          If you find a bug, please send an email to <a
            href={`mailto: ${metadata.adminEmail}`}>{metadata.adminEmail}
          </a>
        </Typography>
      </div>
    </Grid>
  );
};

interface ChessTreePreviewOrSpinnerProps {
  lesson?: Lesson;
  stepper: number;
  boardSize: number;
}

const ChessTreePreviewOrSpinner: React.FC<ChessTreePreviewOrSpinnerProps> = (props) => {
  const classes = useStyles({});

  if (props.lesson == undefined) {
    return <Spinner />;
  } else {
    return (
      <Link className={classes.chessBoardLink} to={getLessonUrlPath(props.lesson)}>
        <ChessTreePreview
          chessTree={props.lesson.chessTree}
          orientation={props.lesson.playedByWhite ? 'white' : 'black'}
          stepper={props.stepper}
          boardSize={props.boardSize}
          showArrows
        />
        <Typography
          className={classes.chessBoardTitle}
          variant='subtitle2'
          align='center'
        >
          {props.lesson.fullName}
        </Typography>
      </Link>
    );
  }
};

export default HomePage;
