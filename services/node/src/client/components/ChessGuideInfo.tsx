import Grid from '@material-ui/core/Grid';
import { makeStyles } from '@material-ui/core';
import Typography from '@material-ui/core/Typography';
import React from 'react';
import { GuideMode } from '../utils/types';

const useStyles = makeStyles(() => ({
  gridContainer: {
    padding: '0 8px',
  },
}));

interface Props {
  numPaths: number;
  numPathsCompleted: number;
  currentGuideMode: GuideMode;
  score: number;
}

const ChessGuideInfo: React.FunctionComponent<Props> = ({
  numPaths,
  numPathsCompleted,
  currentGuideMode,
  score,
}) => {
  const classes = useStyles({});

  const makeScoreString = (): string => {
    if (score === 0) {
      return 'tied game';
    } else if (score > 0) {
      return `white +${score}`;
    } else {
      return `black +${Math.abs(score)}`;
    }
  };

  return (
    <Grid
      container
      className={classes.gridContainer}
      direction='row'
      justify='space-between'
    >
      <Grid item>
        <Typography variant='caption'>
          Paths completed: {numPathsCompleted}/{numPaths}
        </Typography>
      </Grid>
      <Grid item>
        <Typography variant='caption'>{makeScoreString()}</Typography>
      </Grid>
      <Grid item>
        <Typography variant='caption'>Current mode: {currentGuideMode}</Typography>
      </Grid>
    </Grid>
  );
};

export default ChessGuideInfo;
