import React, { Dispatch, SetStateAction, MutableRefObject } from 'react';
import { makeStyles } from '@material-ui/core';
import Grid from '@material-ui/core/Grid';
import Box from '@material-ui/core/Box';
import Checkbox from '@material-ui/core/Checkbox';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import ToolTip from '@material-ui/core/Tooltip';
import ColorSwitch from './ColorSwitch';
import DropDown from './DropDown';
import { PieceColor, ChessOpening } from '../../shared/chessTypes';

const useStyles = makeStyles({
  checkbox: {
    padding: 0,
    margin: '0 6px',
  },
  colorSwitchContainer: {
    paddingTop: '2px',
  },
});

interface Props {
  userColor: PieceColor;
  setUserColor: Dispatch<SetStateAction<PieceColor>>;
  selectedOpening: ChessOpening | '';
  changeSelectedOpening: (opening: string) => void;
  numSelectedTraps: number;
  deselectAll: () => void;
  selectAll: () => void;
  openingsTextFieldRef: MutableRefObject<HTMLInputElement | null>;
}

const SelectTrapsPaneControls: React.FC<Props> = (props) => {
  const classes = useStyles({});

  return (
    <Grid container direction='column' spacing={1}>
      <Grid item>
        <Grid container alignItems='center' justify='space-between'>
          <Grid item>
            <ToolTip title='Deselect All' placement='top' arrow>
              <span>
                <FormControlLabel
                  label='All'
                  control={
                    <Checkbox
                      color='default'
                      checked={props.numSelectedTraps > 0}
                      className={classes.checkbox}
                      onChange={(event) => {
                        event.target.checked ? props.selectAll() : props.deselectAll();
                      }}
                    />
                  }
                />
              </span>
            </ToolTip>
          </Grid>
          <Grid item className={classes.colorSwitchContainer}>
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
            <DropDown
              selectedValue={props.selectedOpening}
              enum={ChessOpening}
              labelText={'Opening'}
              onChange={props.changeSelectedOpening}
            />
          </Box>
        </Box>
      </Grid>
    </Grid>
  );
};

export default SelectTrapsPaneControls;
