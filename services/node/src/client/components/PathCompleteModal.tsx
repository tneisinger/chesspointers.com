import React from 'react';
import { makeStyles } from '@material-ui/core';
import Typography from '@material-ui/core/Typography';
import Modal from './Modal';
import Button from '@material-ui/core/Button';
import Grid from '@material-ui/core/Grid';
import { GuideMode } from '../utils/types';
import LinkMui from './LinkMui';

const useStyles = makeStyles({
  modalTitleText: {
    marginTop: '1rem',
    marginBottom: '0.5rem',
  },
  modalMsgText: {
    marginBottom: '1rem',
  },
});

interface Props {
  isOpenOrOpening: boolean;
  currentGuideMode: GuideMode;
  numPaths: number;
  numPathsCompleted: number;
  handleClose: () => void;
  handleResetBtnClick: () => void;
  handleSwitchToPracticeModeBtnClick: () => void;
}

const PathCompleteModal: React.FC<Props> = ({
  isOpenOrOpening,
  currentGuideMode,
  numPaths,
  numPathsCompleted,
  handleClose,
  handleResetBtnClick,
  handleSwitchToPracticeModeBtnClick,
}) => {
  const classes = useStyles({});

  if (numPathsCompleted < numPaths) {
    return (
      <Modal
        isModalOpenOrOpening={isOpenOrOpening}
        handleClose={handleClose}
        delayOpenFor={500}
      >
        <Typography variant='h4' className={classes.modalTitleText}>
          Good!
        </Typography>
        <Typography className={classes.modalMsgText}>
          {numPathsCompleted} of {numPaths} paths completed
        </Typography>
        <Button variant='contained' color='primary' onClick={handleResetBtnClick}>
          Reset
        </Button>
      </Modal>
    );
  } else if (currentGuideMode === 'learn') {
    return (
      <Modal
        isModalOpenOrOpening={isOpenOrOpening}
        handleClose={handleClose}
        delayOpenFor={500}
      >
        <Typography variant='h4' className={classes.modalTitleText}>
          Great!
        </Typography>
        <Typography className={classes.modalMsgText}>
          You completed all the paths.
        </Typography>
        <Grid container alignItems='center' justify='center' spacing={3}>
          <Grid item>
            <Button
              variant='contained'
              color='primary'
              onClick={handleSwitchToPracticeModeBtnClick}
            >
              Go To Practice Mode
            </Button>
          </Grid>
          <Grid item>
            <Button variant='contained' color='primary' onClick={handleResetBtnClick}>
              Reset
            </Button>
          </Grid>
        </Grid>
      </Modal>
    );
  } else {
    return (
      <Modal
        isModalOpenOrOpening={isOpenOrOpening}
        handleClose={handleClose}
        delayOpenFor={500}
      >
        <Typography variant='h4' className={classes.modalTitleText}>
          Awesome!
        </Typography>
        <Typography className={classes.modalMsgText}>
          You completed all the paths.
        </Typography>
        <Grid container alignItems='center' justify='center' spacing={3}>
          <Grid item>
            <Button variant='contained' color='primary' component={LinkMui('/traps')}>
              Learn a New Trap
            </Button>
          </Grid>
          <Grid item>
            <Button variant='contained' color='primary' onClick={handleResetBtnClick}>
              Reset
            </Button>
          </Grid>
        </Grid>
      </Modal>
    );
  }
};

export default PathCompleteModal;
