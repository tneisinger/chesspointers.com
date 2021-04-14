import React from 'react';
import { makeStyles } from '@material-ui/core';
import Typography from '@material-ui/core/Typography';
import Box from '@material-ui/core/Box';
import Grid from '@material-ui/core/Grid';
import youtubeAcknowledgements from '../../shared/youtubeAcknowledgements.json';

const useStyles = makeStyles(() => ({
  heading: {
    marginBottom: '1rem',
  },
  acknowledgementLink: {
    textDecoration: 'underline',
    marginBottom: '1rem',
  },
  youtubeLinksDiv: {
    margin: '3rem 0',
  },
}));

const AcknowledgementsPage: React.FunctionComponent = () => {
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
          Acknowledgements
        </Typography>
        <Typography align='center'>
          Chess expertise sourced from these excellent YouTube channels:
        </Typography>
        <div className={classes.youtubeLinksDiv}>
          {youtubeAcknowledgements.map(({ title, url }) => (
            <Typography
              key={title}
              className={classes.acknowledgementLink}
              align='center'>
                <a
                  rel='noopener noreferrer'
                  target='_blank'
                  href={url}>
                    {title}
                </a>
              </Typography>
          ))}
        </div>
        <Typography align='center'>
          This project also depends on many <a
            className={classes.acknowledgementLink}
            rel='noopener noreferrer'
            target='_blank'
            href={'#'}>
              third-party software packages.
          </a>
        </Typography>
      </Box>
    </Grid>
  );
};

export default AcknowledgementsPage;
