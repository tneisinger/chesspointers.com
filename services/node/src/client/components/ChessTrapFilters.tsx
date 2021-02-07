import React, { useState, useEffect, Dispatch, SetStateAction } from 'react';
import { ChessTrap } from '../../shared/entity/chessTrap';
import { makeStyles, Theme } from '@material-ui/core';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import ColorSwitch from './ColorSwitch';
import ChessOpeningsDropDown from './ChessOpeningsDropDown';
import { PieceColor, ChessOpening } from '../../shared/chessTypes';
import { filterTrapsWithOpenings } from '../../shared/chessTree';

const useStyles = makeStyles((theme: Theme) => ({
  root: {
    height: '100%',
  },
  textContainer: {
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

  useEffect(() => {
    filterTraps();
  }, [isColorFilterEnabled, selectedColor, selectedOpening]);

  return (
    <Grid container className={classes.root} direction={alignItems} spacing={3}>
      <Grid item className={classes.textContainer}>
        <Typography variant='h5' className={classes.text}>
          Filter By:
        </Typography>
      </Grid>
      <Grid item>
        <ColorSwitch
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
        />
      </Grid>
    </Grid>
  );
};

export default ChessTrapFilters;
