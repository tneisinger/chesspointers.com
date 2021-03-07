import React, { useState } from 'react';
import { Theme } from '@material-ui/core/styles';
import { makeStyles } from '@material-ui/core';
import { ChessTrap } from '../../shared/entity/chessTrap';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import DisplayTraps from '../components/DisplayTraps';
import NoMatchesModal from '../components/NoMatchesModal';
import useDimensions from 'react-use-dimensions';
import WithChessTraps from '../components/WithChessTraps';
import useChessTrapFilters from '../hooks/useChessTrapFilters';
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
  chessTrapsRoot: {
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
    <WithChessTraps
      renderWithChessTraps={(chessTraps) => (
        <ChessTrapsPageContent chessTraps={chessTraps} />
      )}
    />
  );
};

const ChessTrapsPageContent: React.FC<{ chessTraps: ChessTrap[] }> = (props) => {
  const [filtersBarRef, filtersBarDimensions] = useDimensions();

  const [filteredTraps, setFilteredTraps] = useState<ChessTrap[]>([]);
  const [isNoMatchesModalOpen, setIsNoMatchesModalOpen] = useState<boolean>(false);
  const [isFiltersModalOpen, setIsFiltersModalOpen] = useState<boolean>(false);

  const classes = useStyles({ filterBarHeight: filtersBarDimensions.height });

  const [rootDivRef, rootDivDimensions] = useDimensions();

  const onFiltersChange = (filteredTraps: ChessTrap[]) => {
    if (filteredTraps.length < 1) {
      setIsNoMatchesModalOpen(true);
    }
  };

  const chessTrapFiltersToolkit = useChessTrapFilters({
    allTraps: props.chessTraps,
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
        className={classes.chessTrapsRoot}
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
            chessTraps={filteredTraps}
          />
        </Grid>
        <Grid item>
          <FiltersBarOrModalUI
            chessTrapFiltersToolkit={chessTrapFiltersToolkit}
            filtersBarRef={filtersBarRef}
            isModalOpen={isFiltersModalOpen}
            setIsModalOpen={setIsFiltersModalOpen}
          />
        </Grid>
      </Grid>
      <NoMatchesModal
        isModalOpenOrOpening={isNoMatchesModalOpen}
        clearFilters={chessTrapFiltersToolkit.clearFilters}
        closeModal={() => setIsNoMatchesModalOpen(false)}
      />
    </>
  );
};

export default TrapsPage;
