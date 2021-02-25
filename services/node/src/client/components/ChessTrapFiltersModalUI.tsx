import React, { useState } from 'react';
import Grid from '@material-ui/core/Grid';
import Button from '@material-ui/core/Button';
import { makeStyles } from '@material-ui/core';
import ChessTrapFiltersModal from './ChessTrapFiltersModal';
import { ChessTrapFiltersToolkit } from '../hooks/useChessTrapFilters';
import ClearFiltersBtn from './ClearFiltersBtn';

const useStyles = makeStyles({
  filtersModalUIRoot: {
    padding: '8px 4px',
    borderRadius: '6px',
    width: '85vw',
    margin: '0 auto',
  },
  msgText: {
    fontSize: '0.85rem',
  },
});

export interface Props {
  chessTrapFiltersToolkit: ChessTrapFiltersToolkit;
}

const ChessTrapFiltersModalUI: React.FC<Props> = (props) => {
  const classes = useStyles();

  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);

  return (
    <div className={classes.filtersModalUIRoot}>
      <Grid container direction='column' spacing={1}>
        <Grid item>
          <Grid container spacing={5} justify='center'>
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
              <ClearFiltersBtn {...props} />
            </Grid>
          </Grid>
        </Grid>
      </Grid>
      <ChessTrapFiltersModal
        {...props}
        isModalOpen={isModalOpen}
        handleClose={() => setIsModalOpen(false)}
      />
    </div>
  );
};

export default ChessTrapFiltersModalUI;