import React, { RefObject, useState, MutableRefObject } from 'react';
import { ChessTrap } from '../../shared/entity/chessTrap';
import { makeStyles, Theme, Typography } from '@material-ui/core';
import Grid from '@material-ui/core/Grid';
import AppBar from '@material-ui/core/AppBar';
import NoMatchesModal from './NoMatchesModal';
import useChessTrapFilters from '../hooks/useChessTrapFilters';

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
  allTraps: ChessTrap[];
  changeFilteredTraps: (traps: ChessTrap[]) => void;
  filtersBarRef: MutableRefObject<any> | RefObject<HTMLDivElement>;
}

const ChessTrapFiltersBar: React.FC<Props> = ({
  allTraps,
  changeFilteredTraps,
  filtersBarRef,
}) => {
  const classes = useStyles({});

  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);

  const onFiltersChange = (filteredTraps: ChessTrap[]) => {
    if (filteredTraps.length < 1) {
      setIsModalOpen(true);
    }
  };

  const {
    ColorSwitch,
    OpeningsDropDown,
    ClearFiltersBtn,
    clearFilters,
  } = useChessTrapFilters({
    allTraps,
    changeFilteredTraps,
    onFiltersChange,
  });

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
      <NoMatchesModal
        isModalOpenOrOpening={isModalOpen}
        clearFilters={clearFilters}
        closeModal={() => setIsModalOpen(false)}
      />
    </AppBar>
  );
};

export default ChessTrapFiltersBar;
