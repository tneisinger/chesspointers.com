import React from 'react';
import FormControl from '@material-ui/core/FormControl';
import Grid from '@material-ui/core/Grid';
import Select from '@material-ui/core/Select';
import InputLabel from '@material-ui/core/InputLabel';
import MenuItem from '@material-ui/core/MenuItem';
import { ChessOpening } from '../../shared/chessTypes';

interface Props {
  enabled: boolean;
  selectedOpening: string;
  onChange: (opening: ChessOpening) => void;
}

const ChessOpeningsDropDown: React.FC<Props> = (props) => {
  return (
    <Grid container direction='row' spacing={2}>
      <Grid item>
        <FormControl>
          <InputLabel id='opening-select-label'>Opening</InputLabel>
          <Select
            labelId='opening-select-label'
            value={props.selectedOpening}
            onChange={(event: React.ChangeEvent<{ value: unknown }>) => {
              props.onChange(event.target.value as ChessOpening);
            }}
          >
            <MenuItem value='None'>None</MenuItem>
            {Object.entries(ChessOpening).map(([key, value]) => (
              <MenuItem key={key} value={value}>
                {value}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </Grid>
    </Grid>
  );
};

export default ChessOpeningsDropDown;
