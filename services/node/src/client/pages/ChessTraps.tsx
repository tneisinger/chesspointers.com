import React, { useEffect, useState } from 'react';
import { Theme } from '@material-ui/core/styles';
import { makeStyles } from '@material-ui/core';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../redux/store';
import { ChessTrap } from '../../shared/entity/chessTrap';
import { getChessTrapsThunk } from '../redux/chessTrapsSlice';
import DisplayChessTraps from '../components/DisplayChessTraps';
import useDimensions from 'react-use-dimensions';
import ChessTrapFiltersBar from '../components/ChessTrapFiltersBar';

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
  const dispatch = useDispatch();

  const [filtersBarRef, filtersBarDimensions] = useDimensions();

  const [filteredTraps, setFilteredTraps] = useState<ChessTrap[]>([]);

  const classes = useStyles({ filterBarHeight: filtersBarDimensions.height });

  const [rootDivRef, rootDivDimensions] = useDimensions();

  const chessTrapsSlice = useSelector((state: RootState) => state.chessTrapsSlice);

  useEffect(() => {
    if (chessTrapsSlice.requestStatus === 'NO_REQUEST_YET') {
      dispatch(getChessTrapsThunk());
    }
  }, []);

  if (chessTrapsSlice.requestStatus === 'ERROR') {
    return <p>An error occurred: {chessTrapsSlice.error}</p>;
  }

  if (chessTrapsSlice.requestStatus !== 'LOADED') {
    return <p>Loading...</p>;
  }

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
        allTraps={chessTrapsSlice.traps}
        changeFilteredTraps={setFilteredTraps}
        filtersBarRef={filtersBarRef}
      />
    </div>
  );
};

export default ChessTrapsPage;
