import React from 'react';
import { Link } from 'react-router-dom';
import { makeStyles } from '@material-ui/core';
import { useTheme, Theme } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import Grid from '@material-ui/core/Grid';
import Button from '@material-ui/core/Button';
import WithReduxSlice, { ReduxProps } from '../components/WithReduxSlice';
import { EntitiesSlice } from '../redux/types';
import { Lesson } from '../../shared/entity/lesson';
import { getOpeningsThunk } from '../redux/openingsSlice';
import { getTrapsThunk } from '../redux/trapsSlice';
import DisplayLessons from '../components/DisplayLessons';
import { viewportWidth } from '../utils';

const useStyles = makeStyles((theme: Theme) => ({
  homepageRoot: {
    height: '100%',
    padding: '30px 0 10px 0',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-between',
  },
  homepageGridContainer: {
    height: 'inherit',
  },
  heading: {
    [theme.breakpoints.up('lg')]: {
      fontSize: '3.5rem',
    },
  },
  lessonGroupLink: {
    fontWeight: 400,
  },
  paragraph: {
    marginBottom: '1rem',
  },
  buttonStyles: {
    display: 'inline-block',
    padding: '10px',
    borderRadius: '4px',
    fontWeight: 'normal',
    backgroundColor: theme.palette.primary.main,
    boxShadow: theme.shadows[4],
  }
}));

const HomePage: React.FunctionComponent = () => {
  const classes = useStyles({});

  const muiTheme = useTheme();

  const vw = viewportWidth();

  const layoutBreakpoint = muiTheme.breakpoints.values.lg;

  return (
    <Grid className={classes.homepageRoot} item xs={12}>
      <Typography
        className={classes.heading}
        variant='h4'
        component='h2'
        align='center'
      >
        Welcome!
      </Typography>
      {vw >= layoutBreakpoint &&
        <Grid container justify='space-evenly' spacing={0}>
          <Grid item>
            <LessonsGroup
              title='Chess Openings'
              link='/openings'
              reduxThunk={getOpeningsThunk}
              reduxSelector={(state) => state.openingsSlice}
            />
          </Grid>
          <Grid item>
            <LessonsGroup
              title='Chess Traps'
              link='/traps'
              reduxThunk={getTrapsThunk}
              reduxSelector={(state) => state.trapsSlice}
              stepperDelay={350}
            />
          </Grid>
        </Grid>
      }
      {vw < layoutBreakpoint &&
        <Grid
          container
          style={{ height: '100%' }}
          direction='column'
          alignItems='center'
          justify='center'
          spacing={10}
        >
          <Grid item>
            <Button
              size='large'
              variant='contained'
              color='primary'
              component='h3'
            >
              <Link to='/openings'>
                Chess Openings
              </Link>
            </Button>
          </Grid>
          <Grid item>
            <Button
              size='large'
              variant='contained'
              color='primary'
              component='h3'
            >
              <Link to='/traps'>
                Chess Traps
              </Link>
            </Button>
          </Grid>
        </Grid>
      }
      <div>
        <Typography className={classes.paragraph} align='center'>
          This site is a work-in-progress.
        </Typography>
        <Typography className={classes.paragraph} align='center'>
          If you find a bug, please send an email to admin@chesspointers.com
        </Typography>
      </div>
    </Grid>
  );
};

interface ExtraProps {
  title: string;
  link: string;
  stepperDelay?: number;
}

type LessonsGroupProps = ReduxProps<EntitiesSlice<Lesson>> & ExtraProps;

const LessonsGroup = (props: LessonsGroupProps) => {
  return (
    <WithReduxSlice
      WrappedComponent={LessonsGroupContent as any}
      componentExtraProps={props}
      {...props}
    />
  );
}

type LessonsGroupContentProps = EntitiesSlice<Lesson> & ExtraProps;

const LessonsGroupContent: React.FC<LessonsGroupContentProps> = (props) => {
  const classes = useStyles();
  return (
    <Grid container direction='column' alignItems='center'>
      <Grid item>
        <Typography
          className={classes.lessonGroupLink}
          variant='h4'
          component='h3'
          align='center'
        >
          <Link to={props.link}>{props.title}</Link>
        </Typography>
      </Grid>
      <Grid item>
        <DisplayLessons
          allowAnimation
          lessons={props.entities}
          width={425}
          stepperDelay={props.stepperDelay}
        />
      </Grid>
    </Grid>
  );
}

export default HomePage;
