import React from 'react';
import { makeStyles } from '@material-ui/core';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import Grid from '@material-ui/core/Grid';
import Box from '@material-ui/core/Box';
import Modal from './Modal';

const useStyles = makeStyles({
  modalContent: {
    marginTop: '1rem',
  },
});

interface Props {
  isOpenOrOpening: boolean;
  handleOptionSelect: (keepMove: boolean) => void;
  delayOpenFor?: number;
}

const DeadEndModal: React.FC<Props> = (props) => {
  const classes = useStyles(props);

  return (
    <Modal
      isModalOpenOrOpening={props.isOpenOrOpening}
      handleClose={() => void 0}
      includeCloseBtn={false}
      {...props}
    >
      <div className={classes.modalContent}>
        <Typography variant='h4'>Dead End!</Typography>
        <Box m={2}>
          <Typography>
            You have completed all the paths that include that move.
          </Typography>
          <Typography>Do you want to continue anyway?</Typography>
        </Box>
        <Grid container justify='center' spacing={3}>
          <Grid item>
            <Button variant='contained' onClick={() => props.handleOptionSelect(true)}>
              Continue
            </Button>
          </Grid>
          <Grid item>
            <Button variant='contained' onClick={() => props.handleOptionSelect(false)}>
              Undo Move
            </Button>
          </Grid>
        </Grid>
      </div>
    </Modal>
  );
};

export default DeadEndModal;
