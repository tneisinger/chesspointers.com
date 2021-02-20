import React from 'react';
import InputLabel from '@material-ui/core/InputLabel';
import MenuItem from '@material-ui/core/MenuItem';
import Select from '@material-ui/core/Select';
import FormControl from '@material-ui/core/FormControl';
import { makeStyles } from '@material-ui/core';
import Grid from '@material-ui/core/Grid';
import { ChessOpening } from '../../shared/chessTypes';

const useStyles = makeStyles({
  autocomplete: {
    minWidth: (p: { size: string }) => (p.size === 'medium' ? 225 : 200),
  },
});

interface Props {
  selectedOpening: ChessOpening | '';
  onChange: (opening: string) => void;
  size?: 'medium' | 'small';
}

const ChessOpeningsDropDown: React.FC<Props> = ({
  selectedOpening,
  onChange,
  size = 'medium',
}) => {
  const classes = useStyles({ size });

  return (
    <Grid container direction='row' spacing={2}>
      <Grid item>
        <FormControl className={classes.autocomplete}>
          <InputLabel id='chess-openings-dropdown-label'>Opening</InputLabel>
          <Select
            labelId='chess-openings-dropdown-label'
            id='chess-openings-dropdown'
            value={selectedOpening}
            onChange={(e) => onChange(e.target.value as ChessOpening)}
          >
            <MenuItem value=''>None</MenuItem>
            {Object.values(ChessOpening).map((opening) => (
              <MenuItem key={opening} value={opening}>
                {opening}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </Grid>
    </Grid>
  );
};

export default ChessOpeningsDropDown;
