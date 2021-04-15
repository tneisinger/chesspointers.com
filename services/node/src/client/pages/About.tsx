import React from 'react';
import { Link } from 'react-router-dom';
import { makeStyles } from '@material-ui/core';
import Typography from '@material-ui/core/Typography';
import Box from '@material-ui/core/Box';
import Grid from '@material-ui/core/Grid';
import metadata from '../../shared/metadata.json';

const useStyles = makeStyles(() => ({
  aboutRoot: {
    maxWidth: '700px',
    margin: '0 auto',
  },
  heading: {
    marginBottom: '1.25rem',
  },
  bodyText: {
    fontSize: '1.1rem',
  }
}));

const AboutPage: React.FunctionComponent = () => {
  const classes = useStyles({});

  return (
    <Grid item className={classes.aboutRoot}>
      <Box p={4}>
        <Typography
          className={classes.heading}
          variant='h4'
          component='h3'
          align='center'
        >
          About
        </Typography>
        <Typography className={classes.bodyText}>
          <Link to='/'>ChessPointers.com</Link> is a passion project made by someone who
          loves building web apps and studying chess. If you would like to get in touch,
          kindly send an email to
          <a
            href={`mailto: ${metadata.adminEmail}`}> {metadata.adminEmail}
          </a>.
        </Typography>
      </Box>
    </Grid>
  );
};

export default AboutPage;
