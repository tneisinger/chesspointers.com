import React, { useState, useEffect, Dispatch, SetStateAction } from 'react';
import { ChessTrap } from '../../shared/entity/chessTrap';
import Grid from '@material-ui/core/Grid';
import ColorSwitch from './ColorSwitch';
import ChessOpeningsDropDown from './ChessOpeningsDropDown';
import { PieceColor, ChessOpening } from '../../shared/chessTypes';
import { filterTrapsWithOpenings } from '../../shared/chessTree';

interface Props {
  allTraps: ChessTrap[];
  setSelectedTraps: Dispatch<SetStateAction<ChessTrap[]>>;
}

const ChessTrapFilters: React.FC<Props> = ({ allTraps, setSelectedTraps }) => {
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
    <Grid container direction='column' spacing={1}>
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
