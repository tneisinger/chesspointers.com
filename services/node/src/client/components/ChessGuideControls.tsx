import { makeStyles } from '@material-ui/core';
import Grid from '@material-ui/core/Grid';
import Button from '@material-ui/core/Button';
import Box from '@material-ui/core/Box';
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
  onHintRequest: () => void;
  SettingsBtn?: React.FC;
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
  onHintRequest,
  SettingsBtn,
}) => {
  const classes = useStyles({});

  return (
    <Grid
      className={classes.root}
      container
      direction='row'
      justify='space-evenly'
      spacing={2}
    >
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
        <Grid container spacing={3}>
          <Grid item>
            <Button variant='contained' color='primary' onClick={onResetBtnClick}>
              Reset
            </Button>
          </Grid>
          <Grid item>
            <Button variant='contained' color='primary' onClick={onModeSwitchBtnClick}>
              {currentMode === 'learn' ? 'practice' : 'learn'}
            </Button>
          </Grid>
          {currentMode === 'practice' && (
            <Grid item>
              <Button variant='contained' color='primary' onClick={onHintRequest}>
                Hint
              </Button>
            </Grid>
          )}
          {SettingsBtn != undefined && (
            <Grid item>
              <Box mt={0.5}>
                <SettingsBtn />
              </Box>
            </Grid>
          )}
        </Grid>
      </Grid>
    </Grid>
  );
};

export default ChessGuideControls;
