import { makeStyles } from '@material-ui/core';
import Grid from '@material-ui/core/Grid';
import Button from '@material-ui/core/Button';
import React from 'react';
import ChessNavBtns from './ChessNavBtns';
import { GuideMode } from '../utils/types';

const useStyles = makeStyles(() => ({
  root: {
    marginTop: '1rem',
    marginBottom: '-0.5rem',
  },
}));

interface Props {
  areBackBtnsEnabled: boolean;
  areForwardBtnsEnabled: boolean;
  onJumpBackBtnClick: () => void;
  onJumpForwardBtnClick: () => void;
  onStepBackBtnClick: () => void;
  onStepForwardBtnClick: () => void;
  onResetBtnClick: () => void;
  onModeSwitchBtnClick: () => void;
  currentMode: GuideMode;
}

const ChessGuideControls: React.FC<Props> = ({
  areBackBtnsEnabled,
  areForwardBtnsEnabled,
  onJumpBackBtnClick,
  onJumpForwardBtnClick,
  onStepBackBtnClick,
  onStepForwardBtnClick,
  onResetBtnClick,
  onModeSwitchBtnClick,
  currentMode,
}) => {
  const classes = useStyles({});

  return (
    <Grid className={classes.root} container direction='row' justify='space-evenly'>
      <Grid item>
        <ChessNavBtns
          areBackBtnsEnabled={areBackBtnsEnabled}
          areForwardBtnsEnabled={areForwardBtnsEnabled}
          jumpToStart={onJumpBackBtnClick}
          jumpToEnd={onJumpForwardBtnClick}
          stepForward={onStepForwardBtnClick}
          stepBack={onStepBackBtnClick}
        />
      </Grid>
      <Grid item>
        <Grid container spacing={2}>
          <Grid item>
            <Button variant='contained' color='primary' onClick={onResetBtnClick}>
              Reset
            </Button>
          </Grid>
          <Grid item>
            <Button variant='contained' color='primary' onClick={onModeSwitchBtnClick}>
              Switch to {currentMode === 'learn' ? 'practice' : 'learn'} mode
            </Button>
          </Grid>
        </Grid>
      </Grid>
    </Grid>
  );
};

export default ChessGuideControls;
