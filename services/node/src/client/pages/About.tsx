import React from 'react';
import { makeStyles } from '@material-ui/core';
import Typography from '@material-ui/core/Typography';
import Box from '@material-ui/core/Box';
import Grid from '@material-ui/core/Grid';

const useStyles = makeStyles(() => ({
  heading: {
    marginBottom: '1rem',
  }
}));

const AboutPage: React.FunctionComponent = () => {
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
          About
        </Typography>
        <Typography align='center'>
          The goal of this site is to help you get better at chess.
        </Typography>
      </Box>
    </Grid>
  );
};

export default AboutPage;
