import React from 'react';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/core';
import Modal from './Modal';

const useStyles = makeStyles({
  modalTitleText: {
    padding: '16px',
  },
});

interface Props {
  isModalOpenOrOpening: boolean;
  clearFilters: () => void;
  closeModal: () => void;
}

const ComponentName: React.FC<Props> = (props) => {
  const classes = useStyles();

  const handleClearFiltersBtnClick = () => {
    props.clearFilters();
    props.closeModal();
  };

  return (
    <Modal {...props} handleClose={() => void 0} includeCloseBtn={false}>
      <Typography className={classes.modalTitleText} variant='h5' component='h5'>
        No Matches Found!
      </Typography>
      <Button variant='contained' color='secondary' onClick={handleClearFiltersBtnClick}>
        Clear Filters
      </Button>
    </Modal>
  );
};

export default ComponentName;
