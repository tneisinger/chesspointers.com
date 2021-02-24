import React, { RefObject, MutableRefObject } from 'react';
import { makeStyles, Theme, Typography } from '@material-ui/core';
import Grid from '@material-ui/core/Grid';
import AppBar from '@material-ui/core/AppBar';
import { ChessTrapFiltersToolkit } from '../hooks/useChessTrapFilters';

const useStyles = makeStyles((theme: Theme) => ({
  contentGridContainer: {
    height: '100%',
    width: '100vw',
    maxWidth: 800,
    margin: '0 auto',
  },
  verticallyCentered: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  },
  text: {
    color: theme.palette.text.primary,
  },
  filtersBar: {
    opacity: 0.95,
    padding: '8px 4px',
    position: 'fixed',
    left: 0,
    right: 0,
    marginLeft: 'auto',
    marginRight: 'auto',
    top: 'auto',
    bottom: 0,
  },
}));

interface Props {
  chessTrapFiltersToolkit: ChessTrapFiltersToolkit;
  filtersBarRef: MutableRefObject<any> | RefObject<HTMLDivElement>;
}

const ChessTrapFiltersBar: React.FC<Props> = ({
  chessTrapFiltersToolkit,
  filtersBarRef,
}) => {
  const classes = useStyles({});

  const { ColorSwitch, OpeningsDropDown, ClearFiltersBtn } = chessTrapFiltersToolkit;

  return (
    <AppBar ref={filtersBarRef} className={classes.filtersBar} color='default'>
      <div className={classes.contentGridContainer}>
        <Grid container direction='row' alignItems='center' justify='space-evenly'>
          <Grid item>
            <Typography variant='h5' component='label'>
              Filter By:
            </Typography>
          </Grid>
          <Grid item>
            <ColorSwitch />
          </Grid>
          <Grid item>
            <OpeningsDropDown />
          </Grid>
          <Grid item className={classes.verticallyCentered}>
            <ClearFiltersBtn />
          </Grid>
        </Grid>
      </div>
    </AppBar>
  );
};

export default ChessTrapFiltersBar;
