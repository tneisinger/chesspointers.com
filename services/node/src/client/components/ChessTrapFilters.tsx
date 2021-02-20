import React, { useState, useEffect, Dispatch, SetStateAction } from 'react';
import { ChessTrap } from '../../shared/entity/chessTrap';
import { makeStyles, Theme } from '@material-ui/core';
import Grid from '@material-ui/core/Grid';
import IconButton from '@material-ui/core/IconButton';
import ClearIcon from '@material-ui/icons/Clear';
import ColorSwitchWithCheckbox from './ColorSwitchWithCheckbox';
import ChessOpeningsDropDown from './ChessOpeningsDropDown';
import { PieceColor, ChessOpening } from '../../shared/chessTypes';
import { filterTrapsWithOpenings } from '../../shared/chessTree';

const useStyles = makeStyles((theme: Theme) => ({
  root: {
    height: '100%',
  },
  verticallyCentered: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  },
  text: {
    color: theme.palette.text.primary,
  },
}));

interface Props {
  allTraps: ChessTrap[];
  setSelectedTraps: Dispatch<SetStateAction<ChessTrap[]>>;
  alignItems?: 'row' | 'column';
}

const ChessTrapFilters: React.FC<Props> = ({
  allTraps,
  setSelectedTraps,
  alignItems = 'row',
}) => {
  const classes = useStyles({});

  const [selectedColor, setSelectedColor] = useState<PieceColor>('white');
  const [isColorFilterEnabled, setIsColorFilterEnabled] = useState(false);
  const [selectedOpening, setSelectedOpening] = useState<ChessOpening | ''>('');

  const filterTraps = () => {
    let filteredTraps = allTraps;
    if (isColorFilterEnabled) {
      filteredTraps = filteredTraps.filter(
        (trap) => trap.playedByWhite === (selectedColor === 'white'),
      );
    }
    if (selectedOpening !== '') {
      filteredTraps = filterTrapsWithOpenings([selectedOpening], filteredTraps);
    }
    setSelectedTraps(filteredTraps);
  };

  const areAnyFiltersEnabled = (): boolean =>
    isColorFilterEnabled || selectedOpening !== null;

  const clearFilters = () => {
    setIsColorFilterEnabled(false);
    setSelectedOpening('');
  };

  const handleOpeningsDropdownChange = (opening: string) => {
    if (opening === '') {
      setSelectedOpening(opening);
    } else if (Object.values(ChessOpening).includes(opening as ChessOpening)) {
      setSelectedOpening(opening as ChessOpening);
    } else {
      throw new Error(`Unrecognized chess opening: ${opening}`);
    }
  };

  // Whenever any filter option changes...
  useEffect(() => {
    filterTraps();
    // Scroll to the top of the page
    window.scrollTo(0, 0);
  }, [isColorFilterEnabled, selectedColor, selectedOpening]);

  return (
    <Grid
      container
      className={classes.root}
      direction={alignItems}
      spacing={1}
      justify='space-around'
    >
      <Grid item>
        <ColorSwitchWithCheckbox
          isEnabled={isColorFilterEnabled}
          setIsEnabled={setIsColorFilterEnabled}
          selectedColor={selectedColor}
          setSelectedColor={setSelectedColor}
        />
      </Grid>
      <Grid item>
        <ChessOpeningsDropDown
          selectedOpening={selectedOpening}
          onChange={handleOpeningsDropdownChange}
        />
      </Grid>
      <Grid item className={classes.verticallyCentered}>
        <IconButton onClick={clearFilters} disabled={!areAnyFiltersEnabled()}>
          <ClearIcon />
        </IconButton>
      </Grid>
    </Grid>
  );
};

export default ChessTrapFilters;
