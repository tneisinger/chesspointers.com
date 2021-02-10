import React, { Dispatch, SetStateAction, MutableRefObject } from 'react';
import { makeStyles } from '@material-ui/core';
import Grid from '@material-ui/core/Grid';
import Box from '@material-ui/core/Box';
import Checkbox from '@material-ui/core/Checkbox';
import ToolTip from '@material-ui/core/Tooltip';
import ColorSwitch from './ColorSwitch';
import ChessOpeningsDropDown from './ChessOpeningsDropDown';
import { PieceColor, ChessOpening } from '../../shared/chessTypes';

const useStyles = makeStyles({
  checkbox: {
    padding: 0,
  },
});

interface Props {
  userColor: PieceColor;
  setUserColor: Dispatch<SetStateAction<PieceColor>>;
  selectedOpening: ChessOpening | null;
  setSelectedOpening: Dispatch<SetStateAction<ChessOpening | null>>;
  numSelectedTraps: number;
  deselectAll: () => void;
  openingsTextFieldRef: MutableRefObject<HTMLInputElement | null>;
}

const SelectTrapsPaneControls: React.FC<Props> = (props) => {
  const classes = useStyles({});

  return (
    <Grid container direction='column' spacing={1}>
      <Grid item>
        <Grid container justify='space-between'>
          <Grid item>
            <ToolTip title='Deselect All' placement='top' arrow>
              <span>
                <Checkbox
                  color='default'
                  disabled={props.numSelectedTraps < 1}
                  checked={props.numSelectedTraps > 0}
                  className={classes.checkbox}
                  onChange={props.deselectAll}
                />
              </span>
            </ToolTip>
          </Grid>
          <Grid item>
            <ColorSwitch
              selectedColor={props.userColor}
              setSelectedColor={props.setUserColor}
              size='small'
            />
          </Grid>
        </Grid>
      </Grid>
      <Grid item>
        <Box display='flex' justifyContent='center'>
          <Box>
            <ChessOpeningsDropDown
              selectedOpening={props.selectedOpening}
              onChange={props.setSelectedOpening}
              size='small'
              textFieldRef={props.openingsTextFieldRef}
            />
          </Box>
        </Box>
      </Grid>
    </Grid>
  );
};

export default SelectTrapsPaneControls;
