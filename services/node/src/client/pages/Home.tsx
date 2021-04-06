import React from 'react';
import { makeStyles } from '@material-ui/core';
import Typography from '@material-ui/core/Typography';
import Box from '@material-ui/core/Box';
import Grid from '@material-ui/core/Grid';

const useStyles = makeStyles(() => ({
  mainCard: {
    padding: '0 40px',
    marginTop: '20px',
  },
  cardHeader: {
    textAlign: 'center',
    paddingBottom: '0',
    marginBottom: '0',
  },
  heading: {
    marginBottom: '1rem',
  }
}));

const HomePage: React.FunctionComponent = () => {
  const classes = useStyles({});

  return (
    <Grid item xs={12}>
      <Box p={4}>
        <Typography
          className={classes.heading}
          variant='h4'
          component='h3'
          align='center'
        >
          Welcome!
        </Typography>
        <Typography align='center'>
          This web app is still a work-in-progress.
        </Typography>
        <Typography align='center'>
          If you find a bug, please send an email to admin@chesspointers.com
        </Typography>
      </Box>
    </Grid>
  );
};

export default HomePage;
