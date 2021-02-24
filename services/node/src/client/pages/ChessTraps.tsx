import React, { useState } from 'react';
import { Theme } from '@material-ui/core/styles';
import { makeStyles } from '@material-ui/core';
import { ChessTrap } from '../../shared/entity/chessTrap';
import DisplayChessTraps from '../components/DisplayChessTraps';
import NoMatchesModal from '../components/NoMatchesModal';
import useDimensions from 'react-use-dimensions';
import ChessTrapFiltersBar from '../components/ChessTrapFiltersBar';
import WithChessTraps from '../components/WithChessTraps';
import useChessTrapFilters from '../hooks/useChessTrapFilters';

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
    height: '100%',
  },
  displayChessTraps: {
    height: (p: { filterBarHeight: number }) => `calc(100% - ${p.filterBarHeight}px)`,
  },
}));

const ChessTrapsPage: React.FunctionComponent = () => {
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
    <div className={classes.chessTrapsRoot} ref={rootDivRef}>
      <DisplayChessTraps
        className={classes.displayChessTraps}
        parentWidth={rootDivDimensions.width}
        trapsPerRow={trapsPerRow}
        chessTraps={filteredTraps}
      />
      <ChessTrapFiltersBar
        chessTrapFiltersToolkit={chessTrapFiltersToolkit}
        filtersBarRef={filtersBarRef}
      />
      <NoMatchesModal
        isModalOpenOrOpening={isNoMatchesModalOpen}
        clearFilters={chessTrapFiltersToolkit.clearFilters}
        closeModal={() => setIsNoMatchesModalOpen(false)}
      />
    </div>
  );
};

export default ChessTrapsPage;
