import React, { useState, useEffect, Dispatch, SetStateAction } from 'react';
import { ChessTrap } from '../../shared/entity/chessTrap';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import ColorSwitch from './ColorSwitch';
import ChessOpeningsDropDown from './ChessOpeningsDropDown';
import { PieceColor, ChessOpening } from '../../shared/chessTypes';
import { filterTrapsWithOpenings } from '../../shared/chessTree';

interface Props {
  traps: ChessTrap[];
  setSelectedTraps: Dispatch<SetStateAction<ChessTrap[]>>;
}

type ChessOpeningOrNone = ChessOpening | 'None';

const ChessTrapFilters: React.FC<Props> = ({ traps, setSelectedTraps }) => {
  const [selectedColor, setSelectedColor] = useState<PieceColor>('white');
  const [isColorFilterEnabled, setIsColorFilterEnabled] = useState(false);
  const [selectedOpening, setSelectedOpening] = useState<ChessOpeningOrNone>('None');

  const filterTraps = () => {
    let filteredTraps = traps;
    if (isColorFilterEnabled) {
      filteredTraps = filteredTraps.filter(
        (trap) => trap.playedByWhite === (selectedColor === 'white'),
      );
    }
    if (selectedOpening !== 'None') {
      filteredTraps = filterTrapsWithOpenings([selectedOpening], filteredTraps);
    }
    setSelectedTraps(filteredTraps);
  };

  useEffect(() => {
    filterTraps();
  }, [isColorFilterEnabled, selectedColor, selectedOpening]);

  return (
    <Grid container direction='column' spacing={2}>
      <Grid item>
        <Typography>Filters</Typography>
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
          enabled
          selectedOpening={selectedOpening}
          onChange={setSelectedOpening}
        />
      </Grid>
    </Grid>
  );
};

export default ChessTrapFilters;
