import React, { Dispatch, SetStateAction } from 'react';
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
  isModalOpen: boolean;
  setIsModalOpen: Dispatch<SetStateAction<boolean>>;
}

const ChessTrapFiltersModalUI: React.FC<Props> = (props) => {
  const classes = useStyles();

  return (
    <div className={classes.filtersModalUIRoot}>
      <Grid container direction='column' spacing={1}>
        <Grid item>
          <Grid container spacing={5} justify='center'>
            <Grid item>
              <Button
                variant='contained'
                color='primary'
                onClick={() => props.setIsModalOpen(true)}
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
        isModalOpen={props.isModalOpen}
        handleClose={() => props.setIsModalOpen(false)}
      />
    </div>
  );
};

export default ChessTrapFiltersModalUI;
