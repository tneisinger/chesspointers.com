import React from 'react';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import Modal from './Modal';
import { ChessTrapFiltersToolkit } from '../hooks/useChessTrapFilters';

interface Props {
  chessTrapFiltersToolkit: ChessTrapFiltersToolkit;
  isModalOpen: boolean;
  handleClose: () => void;
}

const ChessTrapFiltersModal: React.FC<Props> = (props) => {
  const { ColorSwitch, OpeningsDropDown } = props.chessTrapFiltersToolkit;

  return (
    <Modal isModalOpenOrOpening={props.isModalOpen} handleClose={props.handleClose}>
      <Grid container direction='column' alignItems='center' spacing={3}>
        <Grid item>
          <Typography variant='h5' component='h4'>
            Filter By:
          </Typography>
        </Grid>
        <Grid item>
          <ColorSwitch />
        </Grid>
        <Grid item>
          <OpeningsDropDown />
        </Grid>
        <Grid item>
          <Grid container spacing={3}>
            <Grid item>
              <Button
                variant='contained'
                color='primary'
                onClick={() => props.handleClose()}
              >
                OK
              </Button>
            </Grid>
          </Grid>
        </Grid>
      </Grid>
    </Modal>
  );
};

export default ChessTrapFiltersModal;
