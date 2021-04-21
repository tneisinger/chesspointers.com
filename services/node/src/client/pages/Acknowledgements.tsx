import React from 'react';
import { makeStyles } from '@material-ui/core';
import Typography from '@material-ui/core/Typography';
import Grid from '@material-ui/core/Grid';
import metadata from '../../shared/metadata.json';

const useStyles = makeStyles(() => ({
  acknowledgementsRoot: {
    padding: '32px 16px',
    maxWidth: '700px',
    margin: '0 auto',
  },
  heading: {
    marginBottom: '1rem',
  },
  link: {
    textDecoration: 'underline',
    margin: '1rem',
  },
  sectionDiv: {
    margin: '36px auto 0 auto',
    padding: '20px',
    border: '1px solid gray',
  },
}));

const AcknowledgementsPage: React.FunctionComponent = () => {
  const classes = useStyles({});

  return (
    <Grid item xs={12} className={classes.acknowledgementsRoot}>
      <Typography
        className={classes.heading}
        variant='h4'
        component='h3'
        align='center'
      >
        Acknowledgements
      </Typography>
      <div className={classes.sectionDiv}>
        <Typography align='center'>
          All chess expertise was sourced from the following YouTube channels:
        </Typography>
        {metadata.acknowledgements.chessExpertise.map(({ title, url }) => (
          <Typography
            key={title}
            className={classes.link}
            align='center'
          >
            <a
              rel='noopener noreferrer'
              target='_blank'
              href={url}>
                {title}
            </a>
          </Typography>
        ))}
      </div>
      <div className={classes.sectionDiv}>
        <Typography align='center'>
          Special thanks to the following resources:
        </Typography>
        {metadata.acknowledgements.software.map(({ title, url }) => (
          <Typography
            key={title}
            className={classes.link}
            align='center'
          >
            <a
              rel='noopener noreferrer'
              target='_blank'
              href={url}>
                {title}
            </a>
          </Typography>
        ))}
      </div>
    </Grid>
  );
};

export default AcknowledgementsPage;
