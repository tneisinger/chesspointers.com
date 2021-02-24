import React, { useState } from 'react';
import Typography from '@material-ui/core/Typography';
import Grid from '@material-ui/core/Grid';
import Button from '@material-ui/core/Button';
import { makeStyles } from '@material-ui/core';
import Modal from './Modal';
import { ChessTrapFiltersToolkit } from '../hooks/useChessTrapFilters';

const useStyles = makeStyles({
  modalTitleText: {
    // padding: '16px',
  },
});

export interface Props {
  chessTrapFiltersToolkit: ChessTrapFiltersToolkit;
}

const ChessTrapFiltersModalUI: React.FC<Props> = ({ chessTrapFiltersToolkit }) => {
  const classes = useStyles();

  const {
    selectedColor,
    selectedOpening,
    ColorSwitch,
    OpeningsDropDown,
    clearFilters,
    areAnyFiltersEnabled,
  } = chessTrapFiltersToolkit;

  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);

  const ClearFiltersBtn = () => {
    return (
      <Button
        variant='contained'
        onClick={clearFilters}
        disabled={!areAnyFiltersEnabled()}
      >
        Clear Filters
      </Button>
    );
  };

  return (
    <>
      <Grid container alignItems='center' direction='column' spacing={0}>
        <Grid item>
          <p>
            selectedColor: {selectedColor} selectedOpening: {selectedOpening}
          </p>
        </Grid>
        <Grid item>
          <Grid container justify='center' spacing={3}>
            <Grid item>
              <Button
                variant='contained'
                color='primary'
                onClick={() => setIsModalOpen(true)}
              >
                Filter
              </Button>
            </Grid>
            <Grid item>
              <ClearFiltersBtn />
            </Grid>
          </Grid>
        </Grid>
      </Grid>
      <Modal isModalOpenOrOpening={isModalOpen} handleClose={() => setIsModalOpen(false)}>
        <Grid container direction='column' alignItems='center' spacing={3}>
          <Grid item>
            <Typography variant='h5' component='h4' className={classes.modalTitleText}>
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
                  onClick={() => setIsModalOpen(false)}
                >
                  OK
                </Button>
              </Grid>
              <Grid item>
                <ClearFiltersBtn />
              </Grid>
            </Grid>
          </Grid>
        </Grid>
      </Modal>
    </>
  );
};

export default ChessTrapFiltersModalUI;
