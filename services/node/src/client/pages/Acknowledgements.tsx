import React from 'react';
import { makeStyles } from '@material-ui/core';
import Typography from '@material-ui/core/Typography';
import Box from '@material-ui/core/Box';
import Grid from '@material-ui/core/Grid';

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
          {youtubeResources.map(({ title, url }) => (
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

interface AcknowledgedResource {
  title: string;
  url: string;
}

const youtubeResources: AcknowledgedResource[] = [
  {
    title: 'thechesswebsite',
    url: 'https://www.youtube.com/channel/UCHz5JQAUSkjxrosDIWCtEdw',
  },
  {
    title: 'GothamChess',
    url: 'https://www.youtube.com/channel/UCQHX6ViZmPsWiYSFAyS0a3Q',
  },
  {
    title: 'ChessCoach Andras',
    url: 'https://www.youtube.com/channel/UCcYZTGsTO5TbCaA1O0wcBzw',
  },
  {
    title: 'Hanging Pawns',
    url: 'https://www.youtube.com/channel/UCkJdvwRC-oGPhRHW_XPNokg',
  },
  {
    title: 'Remote Chess Academy',
    url: 'https://www.youtube.com/channel/UCsKZ2yOsgfNxln8xH5WkGvg',
  },
  {
    title: 'Eric Rosen',
    url: 'https://www.youtube.com/channel/UCXy10-NEFGxQ3b4NVrzHw1Q',
  },
  {
    title: 'The Chess Giant',
    url: 'https://www.youtube.com/channel/UC9kP6NUvOS4_E7az0nfl7TQ',
  },
];
