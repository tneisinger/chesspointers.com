import React from 'react';
import { useHistory } from 'react-router-dom';
import { makeStyles } from '@material-ui/core';
import Typography from '@material-ui/core/Typography';
import Modal from './Modal';
import Button from '@material-ui/core/Button';
import Grid from '@material-ui/core/Grid';
import { GuideMode } from '../utils/types';
import { LessonType } from '../../shared/entity/lesson';
import { capitalizeFirstLetter } from '../../shared/utils';

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
  lessonType: LessonType;
  isOpenOrOpening: boolean;
  currentGuideMode: GuideMode;
  numLines: number;
  numLinesCompleted: number;
  handleClose: () => void;
  handleResetBtnClick: () => void;
  handleSwitchToPracticeModeBtnClick: () => void;
}

const LineCompleteModal: React.FC<Props> = ({
  lessonType,
  isOpenOrOpening,
  currentGuideMode,
  numLines,
  numLinesCompleted,
  handleClose,
  handleResetBtnClick,
  handleSwitchToPracticeModeBtnClick,
}) => {
  const classes = useStyles({});

  const history = useHistory();

  const LearnNewBtn = () => {
    const url = `/${lessonType}s`;
    return (
      <Button
        variant='contained'
        color='primary'
        onClick={() => {
          handleClose();
          history.push(url);
        }}
      >
        Learn a New {capitalizeFirstLetter(lessonType)}
      </Button>
    );
  };

  if (numLinesCompleted < numLines) {
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
          {numLinesCompleted} of {numLines} lines completed
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
          You completed all the lines.
        </Typography>
        <Grid container alignItems='center' justify='center' spacing={3}>
          <Grid item>
            <Button
              variant='contained'
              color='primary'
              onClick={handleSwitchToPracticeModeBtnClick}
            >
              Switch To Practice Mode
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
          You completed all the lines.
        </Typography>
        <Grid container alignItems='center' justify='center' spacing={3}>
          <Grid item>
            <LearnNewBtn />
          </Grid>
        </Grid>
      </Modal>
    );
  }
};

export default LineCompleteModal;
