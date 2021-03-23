import Grid from '@material-ui/core/Grid';
import { makeStyles } from '@material-ui/core';
import Typography from '@material-ui/core/Typography';
import React from 'react';
import { GuideMode } from '../utils/types';
import { capitalizeFirstLetter } from '../../shared/utils';

const useStyles = makeStyles(() => ({
  gridContainer: {
    padding: 0,
  },
}));

interface Props {
  numLines: number;
  numLinesCompleted: number;
  currentGuideMode: GuideMode;
  score: number;
}

const ChessGuideInfo: React.FunctionComponent<Props> = ({
  numLines,
  numLinesCompleted,
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
      justify='space-around'
    >
      <Grid item>
        <Typography variant='caption'>{makeScoreString()}</Typography>
      </Grid>
      <Grid item>
        <Typography variant='caption'>
          Lines Complete: {numLinesCompleted}/{numLines}
        </Typography>
      </Grid>
      <Grid item>
        <Typography variant='caption'>
          {capitalizeFirstLetter(currentGuideMode)} Mode
        </Typography>
      </Grid>
    </Grid>
  );
};

export default ChessGuideInfo;
