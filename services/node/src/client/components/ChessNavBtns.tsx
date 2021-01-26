import React from 'react';
import { makeStyles } from '@material-ui/core';
import Grid from '@material-ui/core/Grid';
import IconButton from '@material-ui/core/IconButton';
import ArrowLeftIcon from '@material-ui/icons/ArrowLeft';
import ArrowRightIcon from '@material-ui/icons/ArrowRight';
import SkipPreviousIcon from '@material-ui/icons/SkipPrevious';
import SkipNextIcon from '@material-ui/icons/SkipNext';

const useStyles = makeStyles(() => ({
  arrowButton: {
    marginTop: '-10px',
  },
}));

interface Props {
  areBackBtnsEnabled: boolean;
  areForwardBtnsEnabled: boolean;
  jumpToStart: () => void;
  jumpToEnd: () => void;
  stepForward: () => void;
  stepBack: () => void;
}

const ChessNavBtns: React.FunctionComponent<Props> = ({
  areBackBtnsEnabled,
  areForwardBtnsEnabled,
  jumpToStart,
  jumpToEnd,
  stepForward,
  stepBack,
}) => {
  const classes = useStyles({});

  return (
    <Grid item>
      <IconButton
        className={classes.arrowButton}
        aria-label='jump to start'
        onClick={jumpToStart}
        disabled={areBackBtnsEnabled}
      >
        <SkipPreviousIcon />
      </IconButton>
      <IconButton
        className={classes.arrowButton}
        aria-label='step back'
        onClick={stepBack}
        disabled={areBackBtnsEnabled}
      >
        <ArrowLeftIcon fontSize='large' />
      </IconButton>
      <IconButton
        className={classes.arrowButton}
        aria-label='step forward'
        onClick={stepForward}
        disabled={areForwardBtnsEnabled}
      >
        <ArrowRightIcon fontSize='large' />
      </IconButton>
      <IconButton
        className={classes.arrowButton}
        aria-label='jump to end'
        onClick={jumpToEnd}
        disabled={areForwardBtnsEnabled}
      >
        <SkipNextIcon />
      </IconButton>
    </Grid>
  );
};

export default ChessNavBtns;
