import React, { useState, useEffect, Dispatch, SetStateAction, useRef } from 'react';
import { ChessTrap } from '../../shared/entity/chessTrap';
import { makeStyles, Theme } from '@material-ui/core';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
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
  const [selectedOpening, setSelectedOpening] = useState<ChessOpening | null>(null);

  const openingsTextFieldRef = useRef<HTMLInputElement | null>(null);

  const filterTraps = () => {
    let filteredTraps = allTraps;
    if (isColorFilterEnabled) {
      filteredTraps = filteredTraps.filter(
        (trap) => trap.playedByWhite === (selectedColor === 'white'),
      );
    }
    if (selectedOpening != null) {
      filteredTraps = filterTrapsWithOpenings([selectedOpening], filteredTraps);
    }
    setSelectedTraps(filteredTraps);
  };

  const areAnyFiltersEnabled = (): boolean =>
    isColorFilterEnabled || selectedOpening !== null;

  const clearFilters = () => {
    setIsColorFilterEnabled(false);
    setSelectedOpening(null);
    if (openingsTextFieldRef.current != null) {
      openingsTextFieldRef.current.value = '';
    }
  };

  useEffect(() => {
    filterTraps();
  }, [isColorFilterEnabled, selectedColor, selectedOpening]);

  return (
    <Grid
      container
      className={classes.root}
      direction={alignItems}
      spacing={3}
      justify='space-between'
    >
      <Grid item className={classes.verticallyCentered}>
        <Typography variant='h5' className={classes.text}>
          Filter By:
        </Typography>
      </Grid>
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
          onChange={setSelectedOpening}
          textFieldRef={openingsTextFieldRef}
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
