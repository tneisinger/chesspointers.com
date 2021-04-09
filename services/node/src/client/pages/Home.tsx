import React from 'react';
import { useHistory } from 'react-router-dom';
import { makeStyles } from '@material-ui/core';
import { Theme } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import Grid from '@material-ui/core/Grid';
import Button from '@material-ui/core/Button';

const useStyles = makeStyles((theme: Theme) => ({
  homepageRoot: {
    height: '100%',
    padding: '30px 20px 10px 20px',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-around',
  },
  heading: {
    marginBottom: '30px',
    [theme.breakpoints.up('lg')]: {
      fontSize: '3.5rem',
    },
  },
  bigButtonDiv: {
    width: '70vw',
    maxWidth: '375px',
    margin: '0 auto',
  },
  bigButton: {
    display: 'block',
    textAlign: 'center',
    padding: '20px',
    fontSize: '1.25rem',
    margin: '0 auto',
  },
  infoParagraph: {
    fontSize: '1.25rem',
    marginBottom: '8px',
    textAlign: 'center',
  },
  paragraph: {
    marginBottom: '1rem',
  }
}));

const HomePage: React.FunctionComponent = () => {
  const classes = useStyles({});

  const history = useHistory();

  return (
    <Grid className={classes.homepageRoot} item xs={12}>
      <div>
        <Typography
          className={classes.heading}
          variant='h4'
          component='h2'
          align='center'
        >
          Welcome!
        </Typography>
        <Typography className={classes.infoParagraph}>
          Want to improve at chess?
        </Typography>
        <Typography className={classes.infoParagraph}>
          Select a category to get started:
        </Typography>
      </div>
      <div className={classes.bigButtonDiv}>
        <Button
          className={classes.bigButton}
          onClick={() => history.push('/openings')}
          size='large'
          variant='contained'
          color='primary'
          component='h3'
        >
            Chess Openings
        </Button>
      </div>
      <div className={classes.bigButtonDiv}>
        <Button
          className={classes.bigButton}
          onClick={() => history.push('/traps')}
          size='large'
          variant='contained'
          color='primary'
          component='h3'
        >
            Chess Traps
        </Button>
      </div>
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

export default HomePage;
