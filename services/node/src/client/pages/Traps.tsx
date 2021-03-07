import React, { useState } from 'react';
import { Theme } from '@material-ui/core/styles';
import { makeStyles } from '@material-ui/core';
import { Trap } from '../../shared/entity/trap';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import DisplayTraps from '../components/DisplayTraps';
import NoMatchesModal from '../components/NoMatchesModal';
import useDimensions from 'react-use-dimensions';
import WithTraps from '../components/WithTraps';
import useTrapFilters from '../hooks/useTrapFilters';
import FiltersBarOrModalUI, {
  shouldDisplayFiltersBar,
} from '../components/FiltersBarOrModalUI';

const useStyles = makeStyles((theme: Theme) => ({
  titleText: {
    [theme.breakpoints.up('sm')]: {
      fontSize: '3rem',
    },
    [theme.breakpoints.down('sm')]: {
      fontSize: '1.75rem',
    },
  },
  trapsRoot: {
    maxWidth: 'inherit',
    width: 'inherit',
    height: (p: { filterBarHeight: number }) => {
      if (shouldDisplayFiltersBar()) {
        return `calc(100% - ${p.filterBarHeight}px)`;
      } else {
        return '100%';
      }
    },
  },
}));

const TrapsPage: React.FunctionComponent = () => {
  return (
    <WithTraps
      renderWithTraps={(traps) => <TrapsPageContent traps={traps} />}
    />
  );
};

const TrapsPageContent: React.FC<{ traps: Trap[] }> = (props) => {
  const [filtersBarRef, filtersBarDimensions] = useDimensions();

  const [filteredTraps, setFilteredTraps] = useState<Trap[]>([]);
  const [isNoMatchesModalOpen, setIsNoMatchesModalOpen] = useState<boolean>(false);
  const [isFiltersModalOpen, setIsFiltersModalOpen] = useState<boolean>(false);

  const classes = useStyles({ filterBarHeight: filtersBarDimensions.height });

  const [rootDivRef, rootDivDimensions] = useDimensions();

  const onFiltersChange = (filteredTraps: Trap[]) => {
    if (filteredTraps.length < 1) {
      setIsNoMatchesModalOpen(true);
    }
  };

  const trapFiltersToolkit = useTrapFilters({
    allTraps: props.traps,
    changeFilteredTraps: setFilteredTraps,
    onFiltersChange,
  });

  const trapsPerRow = 1;

  return (
    <>
      <Grid
        container
        direction='column'
        justify='space-evenly'
        className={classes.trapsRoot}
        ref={rootDivRef}
      >
        <Grid item>
          <Typography variant='h3' align='center' className={classes.titleText}>
            Traps
          </Typography>
        </Grid>
        <Grid item>
          <DisplayTraps
            parentWidth={rootDivDimensions.width}
            allowAnimation={!isFiltersModalOpen}
            trapsPerRow={trapsPerRow}
            traps={filteredTraps}
          />
        </Grid>
        <Grid item>
          <FiltersBarOrModalUI
            trapFiltersToolkit={trapFiltersToolkit}
            filtersBarRef={filtersBarRef}
            isModalOpen={isFiltersModalOpen}
            setIsModalOpen={setIsFiltersModalOpen}
          />
        </Grid>
      </Grid>
      <NoMatchesModal
        isModalOpenOrOpening={isNoMatchesModalOpen}
        clearFilters={trapFiltersToolkit.clearFilters}
        closeModal={() => setIsNoMatchesModalOpen(false)}
      />
    </>
  );
};

export default TrapsPage;
