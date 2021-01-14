import React, { useState, useEffect, Dispatch, SetStateAction } from 'react';
import Grid from '@material-ui/core/Grid';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Checkbox from '@material-ui/core/Checkbox';
import Typography from '@material-ui/core/Typography';
import Switch from '@material-ui/core/Switch';
import { PieceColor } from '../../shared/chessTypes';
import { ChessTrap } from '../../shared/entity/chessTrap';

interface Props {
  allChessTraps: ChessTrap[];
  setSelectedTraps: Dispatch<SetStateAction<ChessTrap[]>>
  userColor: PieceColor;
  setUserColor: Dispatch<SetStateAction<PieceColor>>
}

const ChessTrapsSelector: React.FunctionComponent<Props> = ({
  allChessTraps,
  setSelectedTraps,
  userColor,
  setUserColor,
}) => {
  const [selectedWhiteTraps, setSelectedWhiteTraps] = useState<ChessTrap[]>([]);
  const [selectedBlackTraps, setSelectedBlackTraps] = useState<ChessTrap[]>([]);

  const handleTrapSelectChange = (
    trap: ChessTrap,
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const [selectedTraps, setSelectedTraps] = trap.playedByWhite ?
        [ selectedWhiteTraps, setSelectedWhiteTraps] :
        [ selectedBlackTraps, setSelectedBlackTraps];
    if (event.target.checked && !isTrapSelected(trap)) {
      setSelectedTraps([...selectedTraps, trap]);
    } else if (!event.target.checked && isTrapSelected(trap)) {
      setSelectedTraps(selectedTraps.filter(t => t.name !== trap.name));
    }
  };

  const getChessTrapsOfUserColor = (): ChessTrap[] => {
    return allChessTraps.filter(t => (
      (t.playedByWhite && userColor === 'white')
      || (!t.playedByWhite && userColor === 'black')
    ));
  }

  const isTrapSelected = (trap: ChessTrap) => {
    const selectedTraps = trap.playedByWhite ? selectedWhiteTraps : selectedBlackTraps;
    return selectedTraps.map(t => t.name).includes(trap.name);
  }

  const getSelectedTraps = (): ChessTrap[] => {
    return userColor === 'white' ? selectedWhiteTraps : selectedBlackTraps;
  }

  const toggleUserColor = (): void => {
    if (userColor === 'white') {
      setUserColor('black');
      setSelectedTraps(selectedBlackTraps);
    }
    if (userColor === 'black') {
      setUserColor('white');
      setSelectedTraps(selectedWhiteTraps);
    }
  }

  useEffect(() => {
    setSelectedTraps(getSelectedTraps());
  }, [selectedWhiteTraps, selectedBlackTraps]);

  return (
    <div>
      <Typography component="div">
        <Grid component="label" container alignItems="center" spacing={1}>
          <Grid item>White</Grid>
          <Grid item>
            <Switch
              checked={userColor === 'black'}
              onChange={toggleUserColor}
              name="selectColor"
              color="default"
              inputProps={{ 'aria-label': 'Select piece color' }}
            />
          </Grid>
          <Grid item>Black</Grid>
        </Grid>
      </Typography>
      { getChessTrapsOfUserColor().map(trap =>
          <FormControlLabel
            key={trap.name}
            control={
              <Checkbox
                name={trap.name}
                checked={isTrapSelected(trap)}
                onChange={(e) => handleTrapSelectChange(trap, e)}
                color="default"
              />
            }
            label={trap.name}
          />
        )
      }
    </div>
  );
}

export default ChessTrapsSelector;
