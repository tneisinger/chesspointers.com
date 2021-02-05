import React from 'react';
import { makeStyles } from '@material-ui/core';
import Typography from '@material-ui/core/Typography';
import Modal from './Modal';
import Button from '@material-ui/core/Button';

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
  handleClose: () => void;
  numPaths: number;
  numPathsCompleted: number;
  handleResetBtnClick: () => void;
}

const PathCompleteModal: React.FC<Props> = (props) => {
  const classes = useStyles({});

  return (
    <Modal
      isModalOpenOrOpening={props.isOpenOrOpening}
      handleClose={props.handleClose}
      delayOpenFor={500}
    >
      <Typography variant='h4' className={classes.modalTitleText}>
        Great Job!
      </Typography>
      <Typography className={classes.modalMsgText}>
        {props.numPathsCompleted} of {props.numPaths} paths complete
      </Typography>
      <Button variant='contained' color='primary' onClick={props.handleResetBtnClick}>
        Reset Game to Complete Next Path
      </Button>
    </Modal>
  );
};

export default PathCompleteModal;
