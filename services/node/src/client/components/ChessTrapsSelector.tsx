import React, { useState, useEffect, Dispatch, SetStateAction } from 'react';
import { makeStyles } from '@material-ui/core';
import Grid from '@material-ui/core/Grid';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Typography from '@material-ui/core/Typography';
import Checkbox from '@material-ui/core/Checkbox';
import Switch from '@material-ui/core/Switch';
import { PieceColor } from '../../shared/chessTypes';
import { ChessTrap } from '../../shared/entity/chessTrap';

const useStyles = makeStyles((theme) => ({
  chessTrapsSelectorRoot: {},
  trapsList: {
    padding: '0 16px',
  },
  colorSwitchWrapper: {
    padding: '8px 0 0 0',
    backgroundColor: theme.palette.action.hover,
  },
}));

interface Props {
  allChessTraps: ChessTrap[];
  setSelectedTraps: Dispatch<SetStateAction<ChessTrap[]>>;
  userColor: PieceColor;
  setUserColor: Dispatch<SetStateAction<PieceColor>>;
}

const ChessTrapsSelector: React.FunctionComponent<Props> = ({
  allChessTraps,
  setSelectedTraps,
  userColor,
  setUserColor,
}) => {
  const classes = useStyles({});

  const [selectedWhiteTraps, setSelectedWhiteTraps] = useState<ChessTrap[]>([]);
  const [selectedBlackTraps, setSelectedBlackTraps] = useState<ChessTrap[]>([]);

  const handleTrapSelectChange = (
    trap: ChessTrap,
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const [selectedTraps, setSelectedTraps] = trap.playedByWhite
      ? [selectedWhiteTraps, setSelectedWhiteTraps]
      : [selectedBlackTraps, setSelectedBlackTraps];
    if (event.target.checked && !isTrapSelected(trap)) {
      setSelectedTraps([...selectedTraps, trap]);
    } else if (!event.target.checked && isTrapSelected(trap)) {
      setSelectedTraps(selectedTraps.filter((t) => t.shortName !== trap.shortName));
    }
  };

  const getChessTrapsOfUserColor = (): ChessTrap[] => {
    return allChessTraps.filter(
      (t) =>
        (t.playedByWhite && userColor === 'white') ||
        (!t.playedByWhite && userColor === 'black'),
    );
  };

  const isTrapSelected = (trap: ChessTrap) => {
    const selectedTraps = trap.playedByWhite ? selectedWhiteTraps : selectedBlackTraps;
    return selectedTraps.map((t) => t.shortName).includes(trap.shortName);
  };

  const getSelectedTraps = (): ChessTrap[] => {
    return userColor === 'white' ? selectedWhiteTraps : selectedBlackTraps;
  };

  const toggleUserColor = (): void => {
    if (userColor === 'white') {
      setUserColor('black');
      setSelectedTraps(selectedBlackTraps);
    }
    if (userColor === 'black') {
      setUserColor('white');
      setSelectedTraps(selectedWhiteTraps);
    }
  };

  useEffect(() => {
    setSelectedTraps(getSelectedTraps());
  }, [selectedWhiteTraps, selectedBlackTraps]);

  return (
    <div className={classes.chessTrapsSelectorRoot}>
      <Grid
        container
        className={classes.colorSwitchWrapper}
        component='label'
        direction='row'
        justify='center'
        spacing={1}
      >
        <Grid item>
          <Typography variant='caption'>White</Typography>
        </Grid>
        <Grid item>
          <Switch
            size='small'
            checked={userColor === 'black'}
            onChange={toggleUserColor}
            name='selectColor'
            color='default'
            inputProps={{ 'aria-label': 'Select piece color' }}
          />
        </Grid>
        <Grid item>
          <Typography variant='caption'>Black</Typography>
        </Grid>
      </Grid>
      <List>
        {getChessTrapsOfUserColor().map((trap) => (
          <ListItem dense key={trap.shortName}>
            <FormControlLabel
              label={<Typography variant='caption'>{trap.shortName}</Typography>}
              control={
                <Checkbox
                  name={trap.shortName}
                  size='small'
                  checked={isTrapSelected(trap)}
                  onChange={(e) => handleTrapSelectChange(trap, e)}
                  color='default'
                />
              }
            />
          </ListItem>
        ))}
      </List>
    </div>
  );
};

export default ChessTrapsSelector;
