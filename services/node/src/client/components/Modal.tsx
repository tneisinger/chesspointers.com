import React, { useState, useEffect } from 'react';
import { makeStyles } from '@material-ui/core';
import Modal from '@material-ui/core/Modal';
import Backdrop from '@material-ui/core/Backdrop';
import Fade from '@material-ui/core/Fade';
import IconButton from '@material-ui/core/IconButton';
import CloseIcon from '@material-ui/icons/Close';

const useStyles = makeStyles((theme) => ({
  modal: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  modalDiv: {
    backgroundColor: theme.palette.background.paper,
    boxShadow: theme.shadows[5],
    padding: 0,
    borderRadius: 10,
    outline: 'none',
  },
  modalCloseBtn: {
    float: 'right',
    margin: 0,
    padding: 0,
  },
  modalContentDiv: {
    padding: '0 40px 20px',
    textAlign: 'center',
  },
}));

interface Props {
  isModalOpenOrOpening: boolean;
  handleClose: () => void;
  delayOpenFor?: number;
  includeCloseBtn?: boolean;
}

const MyModal: React.FunctionComponent<Props> = ({
  isModalOpenOrOpening,
  handleClose,
  delayOpenFor,
  children,
  includeCloseBtn = true,
}) => {
  const classes = useStyles({});

  const [isModalOpen, setIsModalOpen] = useState(false);

  const [openModalTimeout, setOpenModalTimeout] = useState<number | undefined>(undefined);

  // In cleanup, clear all timeouts
  useEffect(() => {
    return clearTimeouts;
  }, []);

  // When `isModalOpenOrOpening` changes...
  useEffect(() => {
    if (isModalOpenOrOpening && !isModalOpen) {
      if (delayOpenFor == undefined) {
        // If modal is opening and no delay is defined, just open the modal
        setIsModalOpen(true);
      } else {
        // If there is a delay, setup a timeout in which we open the modal
        const timeout = window.setTimeout(() => {
          setIsModalOpen(true);
        }, delayOpenFor);
        // Save the timeout reference so we can cancel it later if we need to
        setOpenModalTimeout(timeout);
      }
    }
    if (!isModalOpenOrOpening && isModalOpen) {
      setIsModalOpen(false);
    }
  }, [isModalOpenOrOpening]);

  const clearTimeouts = () => {
    if (openModalTimeout != undefined) {
      window.clearTimeout(openModalTimeout);
      setOpenModalTimeout(undefined);
    }
  };

  return (
    <Modal
      className={classes.modal}
      open={isModalOpen}
      onClose={handleClose}
      closeAfterTransition
      BackdropComponent={Backdrop}
      BackdropProps={{
        timeout: 500,
      }}
    >
      <Fade in={isModalOpen}>
        <div className={classes.modalDiv}>
          <div className={classes.modalCloseBtn}>
            {includeCloseBtn && (
              <IconButton
                aria-label='close'
                style={{ padding: '4px' }}
                onClick={handleClose}
              >
                <CloseIcon />
              </IconButton>
            )}
          </div>
          <div className={classes.modalContentDiv}>{children}</div>
        </div>
      </Fade>
    </Modal>
  );
};

export default MyModal;
