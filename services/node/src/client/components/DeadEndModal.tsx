import React, { Dispatch, SetStateAction } from 'react';
import { makeStyles } from '@material-ui/core';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import Grid from '@material-ui/core/Grid';
import Box from '@material-ui/core/Box';
import Modal from './Modal';
import Checkbox from '@material-ui/core/Checkbox';
import FormControlLabel from '@material-ui/core/FormControlLabel';

const useStyles = makeStyles({
  modalContent: {
    marginTop: '1rem',
  },
  checkbox: {
    display: 'inline-block',
  },
});

interface Props {
  isOpenOrOpening: boolean;
  handleOptionSelect: (keepMove: boolean) => void;
  showAgain: boolean;
  setShowAgain: Dispatch<SetStateAction<boolean>>;
  delayOpenFor?: number;
  maxWidth?: string;
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
            You have completed all the lines that include that move. Do you want to
            continue anyway?
          </Typography>
        </Box>
        <Grid container direction='column' spacing={2}>
          <Grid item>
            <Grid container justify='space-between' spacing={3}>
              <Grid item>
                <Button
                  variant='contained'
                  color='primary'
                  onClick={() => props.handleOptionSelect(false)}
                >
                  Undo Move
                </Button>
              </Grid>
              <Grid item>
                <Button
                  variant='contained'
                  onClick={() => props.handleOptionSelect(true)}
                >
                  Continue
                </Button>
              </Grid>
            </Grid>
          </Grid>
          <Grid item>
            <FormControlLabel
              control={
                <Checkbox
                  color='primary'
                  checked={!props.showAgain}
                  onChange={() => props.setShowAgain(!props.showAgain)}
                />
              }
              label="Don't show this message again"
            />
          </Grid>
        </Grid>
      </div>
    </Modal>
  );
};

export default DeadEndModal;
