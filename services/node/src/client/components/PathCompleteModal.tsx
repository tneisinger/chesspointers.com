import React from 'react';
import { makeStyles } from '@material-ui/core';
import Typography from '@material-ui/core/Typography';
import Modal from './Modal';
import Button from '@material-ui/core/Button';
import { GuideMode } from '../utils/types';
import NavLinkMui from './NavLinkMui';

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
          Great Job!
        </Typography>
        <Typography className={classes.modalMsgText}>
          {numPathsCompleted} of {numPaths} paths complete ({currentGuideMode} mode)
        </Typography>
        <Button variant='contained' color='primary' onClick={handleResetBtnClick}>
          Reset Game to Complete Next Path
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
          Great Job!
        </Typography>
        <Typography className={classes.modalMsgText}>
          You completed all the paths in Learn Mode.
        </Typography>
        <Button
          variant='contained'
          color='primary'
          onClick={handleSwitchToPracticeModeBtnClick}
        >
          Test Your Memory in Practice Mode
        </Button>
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
          Great Job!
        </Typography>
        <Typography className={classes.modalMsgText}>
          You completed all the paths in Practice Mode
        </Typography>
        <Button variant='contained' color='primary' component={NavLinkMui('/traps')}>
          Learn a New Trap
        </Button>
      </Modal>
    );
  }
};

export default PathCompleteModal;
